from django.db import models
from django.contrib.auth import get_user_model
from vendors.models import VendorPackage

User = get_user_model()

class Booking(models.Model):
    """
    represents a client's booking of a vendor's service package.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')  # customer
    vendor_package = models.ForeignKey(VendorPackage, on_delete=models.CASCADE, related_name='bookings')
    event_date = models.DateField()
    event_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(decimal_places=2, default=0.00, max_digits=50)

    def __str__(self):
        return f"Booking by {self.user.username} for {self.vendor_package.vendor.service_name} on {self.event_date} - {self.status}"
