from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('customer', 'Customer'),
    ('vendor', 'Vendor'),
        
]

# user table
class User(AbstractUser):
    full_name = models.CharField(max_length=30)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default="customer")
    groups = models.ManyToManyField(Group, related_name='user_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='user_permissions')
    date_joined = models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(max_length=11, unique=True)

    def __str__(self):
        return f'{self.full_name} - {self.role}'


