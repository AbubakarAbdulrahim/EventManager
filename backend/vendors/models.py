from django.db import models
from django.contrib.auth import get_user_model
import time

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

class Vendor(models.Model):
    """
    represents a vendor offering a specific event service.
    each vendor is linked to a user account.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor_profile")
    service_name = models.CharField(max_length=255, choices=SERVICE_CHOICES)
    location = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    contact = models.CharField(max_length=12)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.location}"  # Assumes custom user has `get_full_name()`


class VendorImages(models.Model):
    """
    stores images associated with a vendor.
    """
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to='vendor_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class VendorAvailability(models.Model):
    ''' 
    stores availability of vendors
    '''
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    day = models.CharField(max_length=3)  # mon, tue, etc.
    start_time = models.TimeField()
    end_time = models.TimeField(default=time(23, 59))  # defaults to 12:00 AM



class VendorPackage(models.Model):
    """
    represents a vendor's service package, including pricing, capacity, and service type.
    """
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="packages")
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    service_mode = models.CharField(max_length=255, null=True, blank=True, help_text="e.g., Indoor, Buffet, Traditional")
    capacity = models.PositiveIntegerField(null=True, blank=True, help_text="Number of guests", default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration = models.CharField(max_length=20, default="per_event", null=True, blank=True)
    

    def __str__(self):
        name = self.vendor.user.get_full_name() if self.vendor and self.vendor.user else "Unknown Vendor"

        if self.service_type == 'event_space':
            return f"Event space for {self.capacity} guests @ ₦{self.price} - {name}"
        elif self.service_type == 'catering':
            return f"Catering ({self.service_mode}) for {self.capacity} guests @ ₦{self.price} - {name}"
        elif self.service_type == 'decoration':
            return f"Decoration for {self.service_mode} @ ₦{self.price} - {name}"
        elif self.service_type == 'photographer':
            return f"{self.service_mode} Photography @ ₦{self.price} - {name}"
        elif self.service_type == 'make_up_artist':
            return f"Make-up artist service @ ₦{self.price} - {name}"
        elif self.service_type == 'musician':
            return f"Music performance for {self.capacity} guests @ ₦{self.price} - {name}"
        elif self.service_type == 'mc':
            return f"MC service for {self.capacity} guests @ ₦{self.price} - {name}"
        else:
            return f"{self.service_type.capitalize()} - {self.capacity} guests @ ₦{self.price} - {name}"
