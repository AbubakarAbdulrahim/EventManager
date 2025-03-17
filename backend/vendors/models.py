from django.db import models
from django.conf import settings 

class Vendors(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vendors")
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
