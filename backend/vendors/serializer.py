from rest_framework import serializers
from .models import Vendor, VendorImages, VendorPackage, VendorAvailability
from django.contrib.auth import get_user_model

User = get_user_model()

DAYS_OF_WEEK = [
    ('Mon', 'Monday'),
    ('Tue', 'Tuesday'),
    ('Wed', 'Wednesday'),
    ('Thu', 'Thursday'),
    ('Fri', 'Friday'),
    ('Sat', 'Saturday'),
    ('Sun', 'Sunday'),
]

# vendor info serializer
class VendorSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField() # to readable string
    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user", 
            "service_name", 
            "location", 
            "created_at"
        ]
        extra_kwargs = {
            "user" : {"read_only" : True},
            "created_at" : {"read_only" : True},
        }

# vendor image serializer
class VendorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorImages
        fields = [
            "id", 
            "image", 
            "uploaded_at"
        ]
        extra_kwargs = {
            "uploaded_at" : {"read_only" : True}
        }

# vendor package serializer
class VendorPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPackage
        fields = [
            "id", 
            "service_type", 
            "service_mode", 
            "capacity", 
            "price",
            "duration"
        ]
        
# vendor detail serilizer
class VendorDetailSerializer(serializers.ModelSerializer):
    images = VendorImageSerializer(many=True, read_only=True)
    packages = VendorPackageSerializer(many=True, read_only=True)
    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user", 
            "service_name", 
            "location", 
            "created_at", 
            "contact",
            "images",
            "packages",
        ]
        extra_kwargs = {
            "created_at" : {"read_only" : True}
        }

class VendorAvailabilitySerializer(serializers.ModelSerializer):
    day = serializers.ChoiceField(choices=DAYS_OF_WEEK)
    class Meta:
        model = VendorAvailability
        fields = [
            "id",
            "vendor",
            "day",
            "start_time",
            "end_time",
            ]
        extra_kwargs = {
            "vendor" : {"read_only" : True},
        }

    def create(self, validated_data):
        vendor = self.context['request'].user.vendor_profile  # Automatically assign the vendor
        return VendorAvailability.objects.create(vendor=vendor, **validated_data)