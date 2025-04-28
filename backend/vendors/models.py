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
LEVEL_CHOICES = (
    ('silver', 'Silver'),
    ('bronze', 'Bronze'),
    ('gold', 'Gold'),
)

class Vendor(models.Model):
    """
    represents a vendor offering a specific event service.
    Each vendor is linked to a user account.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor_profile")
    business_name = models.CharField(max_length=200)
    address = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    years_in_business = models.PositiveIntegerField(default=0)
    certification_list = models.CharField(max_length=255, default="")
    is_approved = models.BooleanField(default=False)

    # suggestions for levelling vendors
    # is_premium = models.BooleanField(default=False)
    # premium_level = models.CharField(max_length=100, choices=LEVEL_CHOICES)

    def __str__(self):
        return f"{self.user.id} - {self.business_name}"


class VendorCertificationImages(models.Model):
    """
    stores certification images for a vendor.
    """
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="certification_images")
    image = models.ImageField(upload_to='vendor_certifications/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class VendorPackage(models.Model):
    """
    represents a vendor's service package including price, capacity, and type.
    """
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="packages")
    service_name = models.CharField(max_length=50)
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    service_mode = models.CharField(max_length=255, null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True, default=0, help_text="Number of guests")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    location = models.CharField(max_length=255)
    additional_info = models.CharField(max_length=255, default="")
    is_approved = models.BooleanField(default=False)
    
    
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


class VendorPackageImages(models.Model):
    """
    stores general images associated with a vendor (e.g. portfolio).
    """
    vendor_package = models.ForeignKey(VendorPackage, on_delete=models.CASCADE, related_name="package_images")
    image = models.ImageField(upload_to='vendor_package_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class VendorPackageAvailability(models.Model):
    """
    stores weekly availability for vendors.
    """
    vendor_package = models.ForeignKey(VendorPackage, on_delete=models.CASCADE, related_name="availability")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(default=time(23, 59))
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('vendor_package', 'date', 'start_time', 'end_time')

    def __str__(self):
        vendor_name = self.vendor_package.vendor.user.get_full_name() if self.vendor_package and self.vendor_package.vendor and self.vendor_package.vendor.user else "Unknown"
        return f"{vendor_name} available on {self.day} from {self.start_time} to {self.end_time}"
