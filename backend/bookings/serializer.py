from rest_framework import serializers
from .models import Booking
from vendors.models import Service, Vendor

# funcs. to import serializers (avoiding circular import)
def get_user_serializer_class():
    from users.serializer import UserProfileSerializer
    return UserProfileSerializer

def get_service_create_serializer_class():
    from vendors.serializer import ServiceCreateSerializer
    return ServiceCreateSerializer

def get_vendor_retrieve_serializer_class():
    from vendors.serializer import VendorRetrieveSerializer
    return VendorRetrieveSerializer

def get_service_retrieve_serializer_class():
    from vendors.serializer import ServiceRetrieveSerializer
    return ServiceRetrieveSerializer



#
#
#



# booking create serializer
class BookingCreateSerializer(serializers.ModelSerializer):
    service_id = serializers.IntegerField(write_only=True)
    vendor_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "event_date",
            "start_time",
            "end_time",
            "total_price",
            "duration",
            
            # additional fields
            "service_id",
            "vendor_id",
        ]
        read_only_fields = [
            "id"
        ]

    # on create
    def create(self, validated_data):
        user = self.context['request'].user

        # getting the service
        service_id = validated_data.pop("service_id")
        vendor_id = validated_data.pop("vendor_id")

        # validate
        if not service_id:
            raise serializers.ValidationError({"service_id": "This field is required"})

        if not vendor_id:
            raise serializers.ValidationError({"vendor_id": "This field is required"})
        
        try:
            service = Service.objects.get(pk=service_id)
        except Service.DoesNotExist:
            raise serializers.ValidationError({"service_id": "Invalid service ID"})

        try:
            vendor = Vendor.objects.get(pk=vendor_id)
        except Vendor.DoesNotExist:
            raise serializers.ValidationError({"vendor_id": "Invalid vendor ID"})

        # save the booking
        booking = Booking.objects.create(
            user=user, 
            service=service,
            vendor=vendor,
            **validated_data
            )
        
        return booking

# booking retrieve serializer
class BookingRetrieveSerializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    vendor = serializers.SerializerMethodField()

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
            "service",
            "vendor"
        ]

    def get_service(self, obj):
        SerializerClass = get_service_retrieve_serializer_class()
        return SerializerClass(obj.service).data

    def get_vendor(self, obj):
        SerializerClass = get_vendor_retrieve_serializer_class()
        return SerializerClass(obj.vendor).data

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
            "service_id",
            "vendor_id"
        ]
    
    # on update
    def update(self, instance, validated_data):
        service_id = validated_data.pop('service_id', None)
        vendor_id = validated_data.pop('vendor_id', None)

        # update the booking
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # validation
        if service_id is not None:
            instance.service.set(service_id)

        if vendor_id is not None:
            instance.vendor.set(vendor_id)
            
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
    service = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    vendor = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            "id",
            "user", 
            "service",
            "vendor",
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
            "service",
            "vendor",
            "event_date",
            "start_time", 
            "end_time",
            "status", 
            "created_at",
            "total_price", 
            "duration",
        ]
    
    def get_service(self, obj):
        SerializerClass = get_service_retrieve_serializer_class()
        return SerializerClass(obj.service).data

    def get_vendor(self, obj):
        SerializerClass = get_vendor_retrieve_serializer_class()
        return SerializerClass(obj.vendor).data

    def get_user(self, obj):
        SerializerClass = get_user_serializer_class()
        return SerializerClass(obj.user).data
