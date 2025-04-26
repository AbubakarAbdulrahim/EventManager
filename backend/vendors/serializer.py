from rest_framework import serializers
from .models import (
    Vendor, 
    VendorPackageImages, 
    VendorPackage, 
    VendorAvailability, 
    VendorCertificationImages
)
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
class VendorCertificationImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorCertificationImages
        fields =[
            "id", 
            "vendor", 
            "image", 
            "uploaded_at",
        ]
        extra_kwargs = {
            "vendor" : {"read_only" : True},
            "uploaded_at" : {"read_only" : True},
        }

# Vendor package image serializer (to be referenced)
class VendorPackageImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPackageImages
        fields = [
            "id", 
            "vendor",
            "image", 
            "uploaded_at"
        ]
        extra_kwargs = {
            "uploaded_at": {"read_only": True},
            "vendor" : {"read_only": True},
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


# vendor package retrieve serializer
class VendorPackageRetrieveSerializer(serializers.ModelSerializer):
    availability = VendorAvailabilitySerializer(many=True, read_only=True)
    package_images = VendorPackageImagesSerializer(many=True, read_only=True)
    
    class Meta:
        model = VendorPackage
        fields = [
            "id",
            "vendor",
            "service_name",
            "service_type",
            "service_mode",
            "capacity",
            "price",
            "location",
            "additional_info",
            "is_approved",

            # additionl 
            "availability",
            "package_images",
            ]
        extra_kwargs = {"vendor" : {"read_only": True}}

# vendor package create put serializer
class VendorPackageCreateSerializer(serializers.ModelSerializer):
    availability = VendorAvailabilitySerializer(many=True)
    package_images = VendorPackageImagesSerializer(many=True)
    
    class Meta:
        model = VendorPackage
        fields = [
            "id",
            "vendor",
            "service_name",
            "service_type", 
            "service_mode", 
            "capacity", 
            "price",
            "location",
            "additional_info",
            "is_approved",

            # additional 
            "availability",
            "package_images"
        ]

    def create(self, validated_data):
        availability_data = validated_data.pop('availability', [])
        package_images_data = validated_data.pop('package_images', [])
        
        # create the package
        package = VendorPackage.objects.create(**validated_data)

        # create the package availability
        for availability in availability_data:
            VendorAvailability.objects.create(vendor_package=package, **availability)
        
        # create the package images
        for image in package_images_data:
            VendorPackageImages.objects.create(vendor=package.vendor, **image)
    
        return package

# vendor retrieve serializer
class VendorRetrieveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    certification_images = VendorCertificationImagesSerializer(many=True, read_only=True)
    packages = VendorPackageRetrieveSerializer(many=True, read_only=True)
    package_images = VendorPackageImagesSerializer(many=True, read_only=True)

    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user",
            "business_name",
            "address", 
            "created_at",
            "years_in_business",
            "certification_list",
            "is_approved",

            # additional
            "certification_images",
            "packages",
            "package_images",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "created_at": {"read_only": True},
            "is_approved" : {"read_only": True},
        }

# vendor create put serializer
class VendorCreateSerializer(serializers.ModelSerializer):
    certification_images = VendorCertificationImagesSerializer(many=True)
    packages = VendorPackageCreateSerializer(many=True)
    package_images = VendorPackageImagesSerializer(many=True)

    class Meta:
        model = Vendor
        fields = [
            "id", 
            "user",
            "business_name",
            "address", 
            "created_at",
            "years_in_business",
            "certification_list",
            "is_approved",

            # additional
            "certification_images",
            "packages",
            "package_images",
        ]

    def create(self, validated_data):

        certification_images_data = validated_data.pop('certification_images', [])
        packages_data = validated_data.pop('packages', [])
         
        # create the vendor
        vendor = Vendor.objects.create(**validated_data)

        # create his certification images
        for image in certification_images_data:
            VendorCertificationImages.objects.create(vendor=vendor, **image)
        
        # create his packages
        for package_data in packages_data:
            
            availability_data = package_data.pop('availability', [])
            package_images_data = package_data.pop('package_images', [])
            
            # creating the package
            package = VendorPackage.objects.create(vendor=vendor, **package_data)

            # creating the package availabilities
            for availability in availability_data:
                VendorAvailability.objects.create(vendor_package=package, **availability)

            # creating the package images
            for image in package_images_data:
                VendorPackageImages.objects.create(vendor=vendor, **image)
        
        return vendor

'''
for admins ->
'''
# vendor serializer for admin
class VendorAdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = '__all__'

# vendor package serializer for admin
class VendorPackageAdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = VendorPackage
        fields = '__all__'
