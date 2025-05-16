from rest_framework import serializers
from .models import Booking
from vendors.models import Service

# funcs. to import serializers (avoiding circular import)
def get_user_serializer_class():
    from users.serializer import UserSerializer
    return UserSerializer

def get_service_create_serializer_class():
    from vendors.serializer import ServiceCreateSerializer
    return ServiceCreateSerializer

def get_service_retrieve_serializer_class():
    from vendors.serializer import ServiceRetrieveSerializer
    return ServiceRetrieveSerializer


#
#
#



# booking create serializer
class BookingCreateSerializer(serializers.ModelSerializer):
    # booking services
    services = serializers.ListField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "event_date",
            "start_time",
            "end_time",
            "total_price",
            "duration",
            
            # additional fields
            "services",
        ]

    # on create
    def create(self, validated_data):
        user = self.context['request'].user

        # getting the service ids
        service_ids = validated_data.pop("services", [])

        # validate
        if not service_ids:
            raise serializers.ValidationError({"vendor_packages": "This field is required"})

        # save the booking
        booking = Booking.objects.create(user=user, **validated_data)

        # manually setting the bookings service ids
        booking.services.set(service_ids)
        booking.save()

        return booking

# booking retrieve serializer
class BookingRetrieveSerializer(serializers.ModelSerializer):
    # bookings services
    services = serializers.SerializerMethodField()
    # bookings user
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

            # additional fields
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

            # additional fields
            "services",
        ]
    
    # on update
    def update(self, instance, validated_data):
        request = self.context.get('request')
        services = validated_data.pop('services', None)

        # update the booking
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # validation
        if services is not None:
            # delete the service reference from the booking
            # and add the new ones
            pass
        
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