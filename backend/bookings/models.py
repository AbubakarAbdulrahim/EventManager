from django.db import models
from django.contrib.auth import get_user_model
from vendors.models import Service

User = get_user_model()

STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
    )
<<<<<<< Updated upstream

# booking table
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    services = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
=======
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')  # customer
    vendor_packages = models.ManyToManyField(VendorPackage, related_name='bookings')
>>>>>>> Stashed changes
    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(decimal_places=2, default=0.00, max_digits=50)
    
    def __str__(self):
        return f"Booking by {self.user.username} for {self.service.vendor.service_name} on {self.event_date} - {self.status}"
