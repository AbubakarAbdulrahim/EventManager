from rest_framework import serializers
from .models import Booking
from users.serializer import UserSerializer

# booking create serializer
class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            # "user", 
            "services",
            "event_date",
            "start_time", 
            "end_time",
            # "status", 
            # "created_at",
            # "total_price", 
            "duration"
            
        ]
        read_only_fields = [
            "status",
            "create_at",
        ]

# booking retrieve serializer
class BookingRetrieveSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Booking
        fields = [
            "id",
            "user", 
            "services",
            "event_date",
            "start_time", 
            "end_time",
            "status", 
            "created_at",
            "total_price", 
            "duration"
        ]
        read_only_fields = [
            "status",
            "create_at",
        ]

# booking update serializer
class BookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "services",
            "event_date",
            "start_time", 
            "end_time",
            "duration",
        ]
    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

# booking destroy serializer
class BookingDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id']
        lookup_field = 'pk'


#
#
#


# bookings serializer for admin
class BookingAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "user", 
            "services",
            "event_date",
            "start_time", 
            "end_time",
            "status", 
            "created_at",
            "total_price", 
            "duration"
        ]
        read_only_fields = [
            "id",
            "user", 
            "services",
            "event_date",
            "start_time", 
            "end_time",
            "status", 
            "created_at",
            "total_price", 
            "duration"
        ]
        
