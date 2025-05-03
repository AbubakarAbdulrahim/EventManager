from rest_framework import serializers
from .models import Booking

# import serializers
def get_user_serializer_class():
    from users.serializer import UserSerializer
    return UserSerializer

def get_service_create_serializer_class():
    from vendors.serializer import ServiceCreateSerializer
    return ServiceCreateSerializer

def get_service_retrieve_serializer_class():
    from vendors.serializer import ServiceRetrieveSerializer
    return ServiceRetrieveSerializer



# booking create serializer
class BookingCreateSerializer(serializers.ModelSerializer):
    services = serializers.ListField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "event_date",
            "start_time",
            "end_time",
            "total_price",
            "duration",
            
            # additional
            "services",
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        service_ids = validated_data.pop("services", [])

        if not service_ids:
            raise serializers.ValidationError({"vendor_packages": "This field is required"})

        booking = Booking.objects.create(user=user, **validated_data)
        booking.services.set(service_ids)
        booking.save()

        return booking

# booking retrieve serializer
class BookingRetrieveSerializer(serializers.ModelSerializer):
    vendor_packages = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "status",
            "start_time",
            "end_time",
            "event_date",
            "total_price",
            "created_at",
            "duration",

            # additional
            "services",
        ]

    def get_services(self, obj):
        SerializerClass = get_service_retrieve_serializer_class()
        return SerializerClass(obj.services.all(), many=True).data

    def get_user(self, obj):
        SerializerClass = get_user_serializer_class()
        return SerializerClass(obj.user).data

# booking update serializer
class BookingUpdateSerializer(serializers.ModelSerializer):
    class Meta():
        model =  Booking
        field = [
            "start_time",
            "end_time",
            "event_date",
            "total_price",
            "duration",

            # additional
            "services",
        ]
    def update(self, instance, validated_data):
        request = self.context.get('request')
        services = validated_data.pop('services', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if services is not None:
            Booking.objects.filter(service=instance).delete()

            for service in services:
                Booking.objects.create(service=service, user=request.user)

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



# booking admin serializer
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
            "duration",
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
            "duration",
        ]