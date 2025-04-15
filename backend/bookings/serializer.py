from rest_framework import serializers
from .models import Booking

# booking serializer
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["user", "venue", "status", "event_date", "total_price", "created_at"]
        read_only_fields = ["user", "status"]
        