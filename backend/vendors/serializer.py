from rest_framework import serializers
from .models import Vendor, VendorPackageImages, VendorPackage, VendorAvailability
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

# Vendor info serializer
class VendorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user", 
            "service_name", 
            "address", 
            "created_at",
            "business_detail",
            "years_in_business",
            "certification_list"
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "created_at": {"read_only": True},
        }

# Vendor package image serializer
class VendorPackageImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPackageImages
        fields = [
            "id", 
            "image", 
            "uploaded_at"
        ]
        extra_kwargs = {
            "uploaded_at": {"read_only": True}
        }

# Vendor availability serializer
class VendorAvailabilitySerializer(serializers.ModelSerializer):
    day = serializers.ChoiceField(choices=DAYS_OF_WEEK)

    class Meta:
        model = VendorAvailability
        fields = [
            "id",
            "vendor_package",
            "day",
            "start_time",
            "end_time",
        ]
        extra_kwargs = {
            "vendor_package": {"read_only": False},
        }

# Vendor package serializer
class VendorPackageSerializer(serializers.ModelSerializer):
    availability = VendorAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = VendorPackage
        fields = [
            "id", 
            "service_name",
            "service_type", 
            "service_mode", 
            "capacity", 
            "price",
            "location",
            "availability"
        ]

# Vendor detail serializer
class VendorDetailSerializer(serializers.ModelSerializer):
    images = VendorPackageImagesSerializer(many=True, read_only=True)
    packages = VendorPackageSerializer(many=True, read_only=True)

    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user", 
            "service_name", 
            "address", 
            "created_at",
            "years_in_business",
            "business_detail",
            "certification_list",
            "images",
            "packages",
        ]
        extra_kwargs = {
            "created_at": {"read_only": True}
        }
