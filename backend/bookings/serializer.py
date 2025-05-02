from rest_framework import serializers
from .models import Booking
from users.serializer import UserSerializer

<<<<<<< Updated upstream
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

=======

# import serializers
def get_user_serializer_class():
    from users.serializer import UserSerializer
    return UserSerializer

def get_package_create_serializer_class():
    from vendors.serializer import VendorPackageCreateSerializer
    return VendorPackageCreateSerializer

def get_package_retrieve_serializer_class():
    from vendors.serializer import VendorPackageRetrieveSerializer
    return VendorPackageRetrieveSerializer


# main Booking Serializer (optional if not used)
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
>>>>>>> Stashed changes


# booking Create Serializer
class BookingCreateSerializer(serializers.ModelSerializer):
    vendor_packages = serializers.ListField(write_only=True)

    class Meta:
        model = Booking
        fields = (
            "vendor_packages",
            "event_date",
            "start_time",
            "end_time",
            "total_price",
        )

    def create(self, validated_data):
        user = self.context['request'].user
        vendor_package_ids = validated_data.pop("vendor_packages", [])

        if not vendor_package_ids:
            raise serializers.ValidationError({"vendor_packages": "This field is required"})

        booking = Booking.objects.create(user=user, **validated_data)
        booking.vendor_packages.set(vendor_package_ids)
        booking.save()

        return booking

# booking retrieve serializer
class BookingRetrieveSerializer(serializers.ModelSerializer):
    vendor_packages = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            "id",
            "user",
            "vendor_packages",
            "status",
            "start_time",
            "end_time",
            "event_date",
            "total_price",
            "created_at",
        )

    def get_vendor_packages(self, obj):
        SerializerClass = get_package_retrieve_serializer_class()
        return SerializerClass(obj.vendor_packages.all(), many=True).data

    def get_user(self, obj):
        SerializerClass = get_user_serializer_class()
        return SerializerClass(obj.user).data

# booking update serializer
class BookingUpdateSerializer(serializers.ModelSerializer):
    class Meta():
        model =  Booking
        field = [
            "vendor_packages",
            # "status",
            "start_time",
            "end_time",
            "event_date",
            "total_price",
            # "created_at",
        ]
    def update(self, instance, validated_data):
        request = self.context.get('request')
        vendor_packages = validated_data.pop('vendor_packages', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if vendor_packages is not None:
            Booking.objects.filter(vendor_packages=instance).delete()
            
            for vendor_package in vendor_packages:
                Booking.objects.create(vendor_packages=vendor_package)
        return instance
        pass

# booking admin serializer
class BookingAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
<<<<<<< Updated upstream
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
        
=======
            "user",
            "vendor_packages",
            "status",
            "start_time",
            "end_time",
            "event_date",
            "total_price",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "vendor_packages",
            # "status",
            "start_time",
            "end_time",
            "event_date",
            "total_price",
            "created_at",
        ]
        
>>>>>>> Stashed changes
