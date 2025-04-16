from rest_framework import serializers
from .models import Booking

# booking serializer
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ("user", "vendor_package", "status", "event_time", "event_date", "total_price", "created_at")
        extra_kwargs = {
            "status" : {"read_only" : True},
            "created_at": {"read_only": True}
        }