from django.db import models
from django.contrib.auth import get_user_model
from datetime import time

User = get_user_model()

SERVICE_CHOICES = (
    ('photographer', 'Photographer'),
    ('event_space', 'Event Space'),
    ('catering', 'Catering'),
    ('decoration', 'Decoration'),
    ('make_up_artist', 'Make Up Artist'),
    ('musician', 'Musician'),
    ('mc', 'MC'),
)
STATUS = (
    ('approved', 'Approved'),
    ('pending', 'Pending'),
    ('rejected', 'Rejected'),
    ('suspended', 'Suspended'),
)
LEVEL_CHOICES = (
    ('silver', 'Silver'),
    ('bronze', 'Bronze'),
    ('gold', 'Gold'),
)
AVAILABILITY_CHOICES = (
    ('specific_date', 'Specific Date'),
    ('recurring', 'Recurring'),
)

# vendor table
class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor_profile")
    business_name = models.CharField(max_length=200)
    address = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    years_in_business = models.PositiveIntegerField(default=0)
    certification_list = models.CharField(max_length=255, default="")
    status = models.CharField(max_length=50, default='pending', choices=STATUS)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.id} - {self.business_name}"

# vendor certification image table
class VendorCertificationImage(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="certification_images")
    image = models.ImageField(upload_to='media/vendor_certifications/')
    image_url = models.URLField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

# service table
class Service(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="services")
    service_name = models.CharField(max_length=50)
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    location = models.CharField(max_length=255)
    availability_start_date = models.DateField()
    availability_end_date = models.DateField()
    availability_type = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES)
    description = models.CharField(max_length=200, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=STATUS)
    # main_image_url = models.URLField()
    amenities = models.CharField(max_length=50, null=True, blank=True)
    service_quantity = models.CharField(max_length=50, null=True, blank=True)
    service_mode = models.CharField(max_length=50, null=True, blank=True)
    
    
    def __str__(self):
        name = self.vendor.user.get_full_name() if self.vendor and self.vendor.user else "Unknown Vendor"
        mode = f" ({self.service_mode})" if self.service_mode else ""

        if self.service_type == 'event_space':
            return f"Event space for {self.capacity} guests @ ₦{self.price} - {name}"
        elif self.service_type == 'catering':
            return f"Catering-{mode} for {self.capacity} guests @ ₦{self.price} - {name}"
        elif self.service_type == 'decoration':
            return f"Decoration-{mode} @ ₦{self.price} - {name}"
        elif self.service_type == 'photographer':
            return f"Photography-{mode} @ ₦{self.price} - {name}"
        elif self.service_type == 'make_up_artist':
            return f"Make-up service @ ₦{self.price} - {name}"
        elif self.service_type == 'musician':
            return f"Music performance @ ₦{self.price} - {name}"
        elif self.service_type == 'mc':
            return f"MC service @ ₦{self.price} - {name}"
        else:
            return f"{self.service_type.capitalize()} for {self.capacity} guests @ ₦{self.price} - {name}"

## vendor package images
class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="service_images")
    image = models.ImageField(upload_to='media/vendor_package_images/')
    image_url = models.URLField()
    is_main = models.BooleanField(default=False)
    sort_order = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

# date specific availability
class ServiceSpecificDateAvailability(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='date_specific_availability')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    

# recurring availability table
class ServiceRecurringAvailability(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='recurring_availability')
    day_of_week = models.PositiveIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
# pricing table
class ServicePricing(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='pricing')
    model_type = models.CharField(max_length=20)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField()

# pricing package
class PricingPackage(models.Model):
    pricing_model = models.ForeignKey(ServicePricing, on_delete=models.CASCADE, related_name='price_packages', null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity_description = models.CharField(max_length=200, null=True, blank=True)