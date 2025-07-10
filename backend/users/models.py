from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


# user's role
ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('customer', 'Customer'),
    ('vendor', 'Vendor'),
]
NOTIFICATION_TYPES = [
    ('warning', 'Warning'),
    ('info', 'Info'),
    ('error', 'Error'),
    ('success', 'Succcess'),
]
NOTIFICATION_PRIORITIES = [
    ('high', 'High'),
    ('medium', 'Medium'),
    ('low', 'Low')
]

# user table
class User(AbstractUser):
    full_name = models.CharField(max_length=30)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default="customer")
    groups = models.ManyToManyField(Group, related_name='user_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='user_permissions')
    date_joined = models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(max_length=11, unique=True)
    avatar = models.ImageField(upload_to='media/users_avatar', blank=True, null=True)
    avatar_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f'{self.id} - {self.full_name} - {self.role}'

# user notification table
class Notification(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    message = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default='success')
    category = models.CharField(max_length=100, null=True, blank=True)
    priority = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)
    # action = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return f"{self.type} notification for {self.user}"


# user events table
class UserEvent(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    vendor = models.ForeignKey("vendors.vendor", null=True, blank=True, on_delete=models.SET_NULL)
    event_type = models.CharField(max_length=100)
    service = models.ForeignKey("vendors.service", null=True, blank=True, on_delete=models.SET_NULL)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user or self.ip_address} - {self.event_type} - Vendor {self.vendor_id}"
