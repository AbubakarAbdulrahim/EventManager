from rest_framework import serializers
from .models import Vendor, VendorPackageImages, VendorPackage, VendorAvailability, VendorCertificationImages
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

# vendor certification images serializer (to be referenced)
class VendorCertificationImagesSeralizer(serializers.ModelSerializer):
    class Meta:
        model = VendorCertificationImages
        fields =["id", "vendor", "image", "uploaded_at"]
        extra_kwargs = {
            "vendor" : {"read_only" : True},
            "uploaded_at" : {"read_only" : True}
        }

# Vendor package image serializer (to be referenced)
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

# vendor availability serializer (to be referenced)
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


# 
# 
#

 
# vendor package detail serializer
class VendorPackageDetailSerializer(serializers.ModelSerializer):
    availability = VendorAvailabilitySerializer(many=True)
    class Meta:
        model = VendorPackage
        fields = [
            "vendor",
            "service_name",
            "service_type",
            "service_mode",
            "capacity",
            "price",
            "location",
            "additional_info",
            # additionl 
            "availability"
            ]

# vendor package create list serializer
class VendorPackageActualSerializer(serializers.ModelSerializer):
    availability = VendorAvailabilitySerializer(many=True, read_only=True)
    package_images = VendorPackageImagesSerializer(many=True)
    
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

            # additional 
            "availability",
            "package_images"
        ]

# vendor detail serializer
class VendorDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    certification_images = VendorCertificationImagesSeralizer(many=True, read_only=True)
    packages = VendorPackageDetailSerializer(many=True, read_only=True)
    package_images = VendorPackageImagesSerializer(many=True, read_only=True)

    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user",
            "address", 
            "created_at",
            "business_detail",
            "years_in_business",
            "certification_list",
            # additional
            "certification_images",
            "packages",
            "package_images"
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "created_at": {"read_only": True},
        }

# vendor create list serializer
class VendorActualSerializer(serializers.ModelSerializer):
    certification_images = VendorCertificationImagesSeralizer(many=True, read_only=True)

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

            # additional
            "certification_images"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
            "user" : {"read_only": True}
        }
