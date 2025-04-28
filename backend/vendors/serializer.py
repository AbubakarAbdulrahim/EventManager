from rest_framework import serializers
from users.serializer import UserSerializer
from .models import (
    Vendor, 
    VendorPackageImages, 
    VendorPackage, 
    VendorPackageAvailability, 
    VendorCertificationImages
)
from django.contrib.auth import get_user_model

User = get_user_model()

# DAYS_OF_WEEK = [
#     ('Mon', 'Monday'),
#     ('Tue', 'Tuesday'),
#     ('Wed', 'Wednesday'),
#     ('Thu', 'Thursday'),
#     ('Fri', 'Friday'),
#     ('Sat', 'Saturday'),
#     ('Sun', 'Sunday'),
# ]

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
class VendorPackageAvailabilitySerializer(serializers.ModelSerializer):
    
    # day = serializers.ChoiceField(choices=DAYS_OF_WEEK)

    class Meta:
        model = VendorPackageAvailability
        fields = [
            "id",
            "vendor_package",
            "date",
            "start_time",
            "end_time",
            "is_available",
        ]
        extra_kwargs = {
            "vendor_package": {"read_only": False},
        }

# service availability serializer (list of only available slots)
class PackageAvailableSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPackageAvailability
        fields = (
            'id',
            'vendor_package',
            'date',
            'start_time',
            'end_time','start_time',
            'end_time',
            )
        read_only_fields = [
            'id', 
            'vendor_package', 
            'date', 
            'start_time',
            'end_time', 
            ]


# 
# 
#


# vendor package retrieve serializer
class VendorPackageRetrieveSerializer(serializers.ModelSerializer):
    availability = VendorPackageAvailabilitySerializer(many=True, read_only=True)
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

# vendor package create serializer
class VendorPackageCreateSerializer(serializers.ModelSerializer):
    availability = VendorPackageAvailabilitySerializer(many=True)
    package_images = VendorPackageImagesSerializer(many=True)
    
    class Meta:
        model = VendorPackage
        fields = [
            "service_name",
            "service_type", 
            "service_mode", 
            "capacity", 
            "price",
            "location",
            "additional_info",
            
            # additional 
            "availability",
            "package_images"
        ]

    def create(self, validated_data):
        request = self.context.get('request')

        availability_data = validated_data.pop('availability', [])
        package_images = request.FILES.getlist('package_images')
        
        # validate
        if not availability_data:
            raise serializers.ValidationError({"availability": "This field is required"})
        if not package_images:
            raise serializers.ValidationError({"package_images": "This field is required"})
        

        # create the package
        package = VendorPackage.objects.create(**validated_data)

        # create the package availability
        for availability in availability_data:
            VendorPackageAvailability.objects.create(vendor_package=package, **availability)
        
        # create the package images
        for image in package_images:
            VendorPackageImages.objects.create(vendor=package.vendor, image=image)
    
        return package

# vendor package update serializer
class VendorPackageUpdateSerializer(serializers.ModelSerializer):
    availability = VendorPackageAvailabilitySerializer(many=True, required=False)
    package_images = VendorPackageImagesSerializer(many=True, required=False)
    
    class Meta:
        model = VendorPackage
        fields = [
            "service_name",
            "service_type", 
            "service_mode", 
            "capacity", 
            "price",
            "location",
            "additional_info",
            
            # additional 
            "availability",
            "package_images"
        ]
    def update(self, instance, validated_data):
        request = self.context.get('request')

        availability = validated_data.pop('availability', None)
        package_images = request.FILES.getlist('package_images')

        # update simple vendor package fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # if availability is provided delete the old ones
        if availability is not None:
            VendorPackageAvailability.objects.filter(vendor_package=instance).delete()

            # create new ones
            for avail in availability:
                VendorPackageAvailability.objects.create(vendor_package=instance, **avail)

        # if images are provided delete the old ones
        if package_images is not None:
            VendorPackageImages.objects.filter(vendor_package=instance).delete()

            # create the new ones
            for image in package_images:
                VendorPackageImages.objects.create(vendor_package=instance, image=image)
        return instance
    
# vendor destroy serializer
class VendorPackageDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPackage
        fields = ['id']
        read_only_fields = ['id']
        lookup_fields = 'pk'


#
#
#


# vendor retrieve serializer
class VendorRetrieveSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
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
            "created_at": {"read_only": True},
            "is_approved" : {"read_only": True},
        }

# vendor create serializer
class VendorCreateSerializer(serializers.ModelSerializer):
    certification_images = VendorCertificationImagesSerializer(many=True, required=False)

    class Meta:
        model = Vendor
        fields = [
            "business_name",
            "address",
            "years_in_business",
            "certification_list",
            "certification_images",
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        certification_images = request.FILES.getlist("certification_images")

        # validate if certification images are provided
        if not certification_images:
            raise serializers.ValidationError({"certification_images": "This field is required."})

        # check if the user is already a vendor
        if Vendor.objects.filter(user=user).exists():
            raise serializers.ValidationError("Vendor already exists for this user.")

        # create the vendor
        vendor = Vendor.objects.create(user=user, **validated_data)

        # create associated certification images
        for image in certification_images:
            VendorCertificationImages.objects.create(vendor=vendor, image=image)

        return vendor

# vendor update serializer
class VendorUpdateSerializer(serializers.ModelSerializer):
    certification_images = VendorCertificationImagesSerializer(many=True, required=False)

    class Meta:
        model = Vendor
        fields = [
            "business_name",
            "address",
            "years_in_business",
            "certification_list",
            "certification_images",
        ]

    def update(self, instance, validated_data):
        request = self.context.get('request')
        certification_images_data = request.FILES.getlist("certification_images")

        # update basic vendor fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # if new certification images are provided, update them
        if certification_images_data is not None:
            # delete old images
            VendorCertificationImages.objects.filter(vendor=instance).delete()

            # create new images
            for image in certification_images_data:
                VendorCertificationImages.objects.create(vendor=instance, image=image)

        return instance

# vendor destroy serializer
class VendorDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id']
        read_only_fields = ['id']
        lookup_field = 'pk'


#
#
#


'''
for admins ->
'''
# vendor serializer for admin
class VendorAdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    certification_images = VendorCertificationImagesSerializer(many=True)
    packages = VendorPackageRetrieveSerializer(many=True)
    package_images = VendorPackageImagesSerializer(many=True)
    class Meta:
        model = Vendor
        fields = '__all__'

# vendor package serializer for admin
class VendorPackageAdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = VendorPackage
        fields = '__all__'
