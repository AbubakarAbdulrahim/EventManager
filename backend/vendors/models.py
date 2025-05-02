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

    # suggestions for levelling vendors
    # is_premium = models.BooleanField(default=False)
    # premium_level = models.CharField(max_length=100, choices=LEVEL_CHOICES)

    def __str__(self):
        return f"{self.user.id} - {self.business_name}"

# vendor certification images
class VendorCertificationImages(models.Model):
    """
    stores certification images for a vendor.
    """
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="certification_images")
    image = models.ImageField(upload_to='media/vendor_certifications/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

# vendor package
class VendorPackage(models.Model):
    """
    represents a vendor's service package including price, capacity, and type.
    """
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="packages")
    
    # venue
    service_name = models.CharField(max_length=50)
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    location = models.CharField(max_length=255)
    additional_info = models.CharField(max_length=255, default="")
    # max_capacity
    # amenities
    # venue type
    
    # catering
    service_mode = models.CharField(max_length=255, null=True, blank=True)
    
    capacity = models.PositiveIntegerField(null=True, blank=True, default=0, help_text="Number of guests")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=50, default='pending', choices=STATUS)
    
    
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

# package price
class PackagePrice(models.Model):
    vendor_package = models.ForeignKey(VendorPackage, on_delete=models.CASCADE, related_name='prices')

    # for catering service
    price_per_plate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    min_plates = models.PositiveIntegerField(null=True, blank=True)
    max_plates = models.PositiveIntegerField(null=True, blank=True)
    food_description = models.TextField(null=True, blank=True)

    # for event space -> venue
    # price per hour
    # per day
    # per event

    max_duration_hours = models.PositiveIntegerField(null=True, blank=True)

    # for photography service
    hourly_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    flat_event_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    coverage_duration_hours = models.PositiveIntegerField(null=True, blank=True)

    # for decoration service
    rate_per_guest = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    decoration_theme_description = models.TextField(null=True, blank=True)

    # for make-up service
    rate_per_person = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    makeup_package_description = models.TextField(null=True, blank=True)

    # for musicians 
    performance_hourly_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    full_event_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    includes_equipment = models.BooleanField(default=False)

    # optional fields
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Price for {self.vendor_package.service_name} ({self.vendor_package.service_type})"

# vendor package images
class VendorPackageImages(models.Model):
    """
    stores general images associated with a vendor (e.g. portfolio).
    """
    vendor_package = models.ForeignKey(VendorPackage, on_delete=models.CASCADE, related_name="package_images")
    image = models.ImageField(upload_to='media/vendor_package_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

# vendor package availability
class VendorPackageAvailability(models.Model):
    """
    stores weekly availability for vendors.
    """
    vendor_package = models.ForeignKey(VendorPackage, on_delete=models.CASCADE, related_name="availability")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)


    class Meta:
        unique_together = ('vendor_package', 'date', 'start_time', 'end_time')

    def __str__(self):
        return f"{self.service.service_name} on {self.date} from {self.start_time} to {self.end_time}"

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