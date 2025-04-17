from django.db import models
from users.models import User

# venue table
class Venue(models.Model):
    name = models.CharField(max_length=255)
    location = models.TextField()
    capacity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='venues')

    def __str__(self):
        return self.name
