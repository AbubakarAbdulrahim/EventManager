from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('venue_owner', 'Venue Owner'),
        ('vendor', 'Vendor'),
    ]

    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(Group, related_name='user_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='user_permissions')

    def __str__(self):
        return f'{self.username} {self.role}'


