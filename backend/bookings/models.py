from django.db import models
from django.contrib.auth import get_user_model
from vendors.models import Vendor, Service

User = get_user_model()

STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )


# booking table
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', null=True)
    vendor = models.ForeignKey(Vendor, related_name='bookings', blank=True, on_delete=models.CASCADE, null=True)
    service = models.ForeignKey(Service, related_name='bookings', on_delete=models.CASCADE, null=True, blank=True)
    event_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    total_price = models.DecimalField(decimal_places=2, default=0.00, max_digits=50, null=True, blank=True)
    duration = models.DurationField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Bookings by {self.user.username} for {self.service} by {self.vendor} on {self.event_date} - {self.status}"