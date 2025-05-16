from django.db import models
from django.contrib.auth import get_user_model
from vendors.models import Service, Vendor

User = get_user_model()

STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
    )


# booking table
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    vendors = models.ManyToManyField('vendors.Vendor', related_name='bookings', blank=True)
    event_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    total_price = models.DecimalField(decimal_places=2, default=0.00, max_digits=50, null=True, blank=True)
    duration = models.DurationField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Booking by {self.user.username} for {self.service.vendor.service_name} on {self.event_date} - {self.status}"
