from rest_framework import serializers
from users.serializer import UserProfileSerializer
from .models import (
    Vendor,
    VendorCertificationImage,
    ServiceImage, 
    Service,
    ServiceAmenity,
    ServiceSpecificDateAvailability,
    ServiceRecurringAvailability,
    ServicePricing,
    PricingPackage,
)
from django.contrib.auth import get_user_model

User = get_user_model()

# vendor certification image create serializer (to be referenced)
class CertificationImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorCertificationImage
        fields =[
            "image",
        ]

# vendor certification images serializer (to be referenced)
class CertificationImageRetrieveSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VendorCertificationImage
        fields =[
            "id", 
            "vendor", 
            "image",
            "image_url",
            "uploaded_at",
        ]
        read_only_fields = [
            "vendor",
            "uploaded_at",
        ]
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            # full absolute URL if request is available
            if request:
                return request.build_absolute_uri(obj.image.url)
            # fallback to relative URL
            return obj.image.url
        return None

# vendor service image retrieve serializer (to be referenced)
class ServiceImageRetrieveSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ServiceImage
        fields = [
            "id", 
            "service",
            "image",
            "image_url",
            "is_main",
            "sort_order",
            "uploaded_at",
        ]
        read_only_fields = [
            "vendor",
            "uploaded_at",
        ]
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            # full absolute URL if request is available
            if request:
                return request.build_absolute_uri(obj.image.url)
            # fallback to relative URL
            return obj.image.url
        return None

# vendor service image create serializer (to be referenced)
class ServiceImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = [
            "image",
            "is_main",
        ]

# service specific date availability create serializer (to be referenced)
class SpecificDateAvailabilityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSpecificDateAvailability
        fields = [
            "date",
            "start_time",
            "end_time",
        ]

# service specific date availability retrieve serializer (to be referenced)
class SpecificDateAvailabilityRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSpecificDateAvailability
        fields = [
            "id",
            "service",
            "date",
            "start_time",
            "end_time",
            "is_available",
        ]
        read_only_fields = [
            "id",
            "service",
        ]

# service recurring availability create serializer (to be referenced)
class RecurringAvailabilityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRecurringAvailability
        fields = [
            "day_of_the_week",
            "start_time",
            "end_time",
        ]

# service recurring availability retrieve serializer (to be referenced)
class RecurringAvailabilityRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRecurringAvailability
        fields = [
            "id",
            "service",
            "day_of_the_week",
            "start_time",
            "end_time",
            "is_available",
        ]
        read_only_fields = [
            "service",
        ]

# price package create serializer (to be referenced)
class PricingPackageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPackage
        fields = [
            "description",
            "name",
            "price",
            "quantity_description",
        ]
    
# price package retrieve serializer (to be referenced)
class PricingPackageRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPackage
        fields = [
            "id",
            "name",
            "description",
            "price",
            "quantity_description",

            # additional
            "pricing_model",
        ]

# service pricing create serializer (to be referenced)
class ServicePricingCreateSerializer(serializers.ModelSerializer):
    price_packages = PricingPackageCreateSerializer(many=True, required=False)

    class Meta:
        model = ServicePricing
        fields = [
            "model_type",
            "base_price",

            # additional
            "price_packages",
        ]

# service pricing retrieve serializer (to be referenced)
class ServicePricingRetrieveSerializer(serializers.ModelSerializer):
    price_packages = PricingPackageCreateSerializer(many=True, read_only=True)

    class Meta:
        model = ServicePricing
        fields = [
            "id",
            "model_type",
            "base_price",

            # additional
            "price_packages",
        ]

# service amenities
class ServiceAmenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAmenity
        fields = ['name']



# 
# 
#


# service retrieve serializer
class ServiceRetrieveSerializer(serializers.ModelSerializer):
    specific_date_avail = SpecificDateAvailabilityRetrieveSerializer(many=True, read_only=True)
    recurring_avail = RecurringAvailabilityRetrieveSerializer(many=True, read_only=True)
    service_images = ServiceImageRetrieveSerializer(many=True, read_only=True)
    pricing = ServicePricingRetrieveSerializer(many=True, read_only=True)
    amenities = ServiceAmenitiesSerializer(many=True, required=False)
    # main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id",
            "vendor",
            "service_name",
            "service_type",
            "location",
            "availability_start_date",
            "availability_end_date",
            "availability_type",
            "description",
            "created_at",
            "updated_at",
            "status",
            "service_quantity",
            "service_mode", 

            # additionl 
            "specific_date_avail",
            "recurring_avail",
            "service_images",
            "pricing",
            "amenities",
            # "main_image_url",
            ]
        read_only_fields = [
            "vendor",
        ]
    # def get_main_image_url(self, obj):
    #     request = self.context.get('request')

    #     if obj.service_images:
    #         for _ in obj.service_images:
    #             if obj.service_images.image and hasattr(obj.service_images.image, 'url'):
    #                 # full absolute URL if request is available
    #                 if request:
    #                     return request.build_absolute_uri(obj.service_images.image.url)
    #                 # fallback to relative URL
    #                 return obj.service_images.image.url
    #     return None

# service create serializer
class ServiceCreateSerializer(serializers.ModelSerializer):
    specific_date_availability = SpecificDateAvailabilityCreateSerializer(many=True, required=False)
    recurring_availability = RecurringAvailabilityCreateSerializer(many=True, required=False)
    service_images = ServiceImageCreateSerializer(many=True, required=False)
    pricing = ServicePricingCreateSerializer(many=True, required=False)
    amenities = ServiceAmenitiesSerializer(many=True, required=False)

    class Meta:
        model = Service
        fields = [
            "service_name",
            "service_type",
            "location",
            "availability_start_date",
            "availability_end_date",
            "availability_type",
            "description",
            "service_quantity",
            "service_mode",

            # additional
            "amenities",
            "specific_date_availability",
            "recurring_availability",
            "service_images",
            "pricing",
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        date_avail = validated_data.pop('specific_date_availability', [])
        recurring_avail = validated_data.pop('recurring_availability', [])
        pricing_data = validated_data.pop('pricing', [])
        service_amenities = validated_data.pop('amenities', [])
        service_images = request.FILES.getlist('service_images')


        # validate that at least one availability type is provided
        if not date_avail and not recurring_avail:
            raise serializers.ValidationError(
                {"specific_date_availability or recurring_availability": "One of these fields must be filled."}
            )

        if not service_images:
            raise serializers.ValidationError({"service_images": "This field is required."})

        # create the main service
        service = Service.objects.create(**validated_data)

        # create its amenities
        for amenity in service_amenities:
            ServiceAmenity.objects.create(service=service, **amenity)

        # create specific date availabilities
        for availability in date_avail:
            ServiceSpecificDateAvailability.objects.create(service=service, **availability)

        # create recurring availabilities
        for availability in recurring_avail:
            ServiceRecurringAvailability.objects.create(service=service, **availability)

        # create the service pricing
        for price_data in pricing_data:
            pricing_packages = price_data.pop('pricing_packages', [])
            service_pricing = ServicePricing.objects.create(service=service, **price_data)
            
            # if nested price packages are provided
            if pricing_packages:
                # create them
                for package in pricing_packages:
                    PricingPackage.objects.create(pricing_model=service_pricing, **package)

        # save images
        for image in service_images:
            ServiceImage.objects.create(service=service, image=image)

        return service
    
# service update serializer
class ServiceUpdateSerializer(serializers.ModelSerializer):
    specific_date_availability = SpecificDateAvailabilityCreateSerializer(many=True, required=False)
    recurring_availability = RecurringAvailabilityCreateSerializer(many=True, required=False)
    service_images = ServiceImageCreateSerializer(many=True, required=False)
    pricing = ServicePricingCreateSerializer(many=True, required=False)
    amenities = ServiceAmenitiesSerializer(many=True, required=False)

    class Meta:
        model = Service
        fields = [
            "service_name",
            "service_type",
            "location",
            "availability_start_date",
            "availability_end_date",
            "availability_type",
            "description",
            "service_quantity",
            "service_mode",

            # additional
            "specific_date_availability",
            "recurring_availability",
            "service_images",
            "pricing",
            "amenities",
        ]

    def update(self, instance, validated_data):
        request = self.context.get('request')
        date_avail = validated_data.pop('specific_date_availability', [])
        recurring_avail = validated_data.pop('recurring_availability', [])
        price_data = validated_data.pop('pricing', [])
        service_amenities = validated_data.pop('amenities', [])
        service_images = request.FILES.getlist('service_images')

        if date_avail and recurring_avail:
            raise serializers.ValidationError(
                {"specific_date_availability or recurring_availability": "Can't fill both fields at the same time."}
            )        

        # update simple service fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # if availability is provided, delete the old ones
        if date_avail or recurring_avail:
            ServiceSpecificDateAvailability.objects.filter(service=instance).delete()
            ServiceRecurringAvailability.objects.filter(service=instance).delete()

            if date_avail:
                for avail in date_avail:
                    ServiceSpecificDateAvailability.objects.create(service=instance, **avail)
            elif recurring_avail:
                for avail in recurring_avail:
                    ServiceRecurringAvailability.objects.create(service=instance, **avail)

        # if images are provided, delete the old ones
        if service_images:
            ServiceImage.objects.filter(service=instance).delete()

            for image in service_images:
                ServiceImage.objects.create(service=instance, image=image)

        # if pricing are provided
        if price_data:
            ServicePricing.objects.filter(service=instance).delete()

            for price in price_data:
                ServicePricing.objects.create(service=instance, **price)

        # if amenities are provided 
        if service_amenities:
            ServiceAmenity.objects.filter(service=instance).delete()

            for amenity in service_amenities:
                ServiceAmenity.objects.create(service=instance, **amenity)

        return instance

# vendor destroy serializer
class ServiceDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id']
        lookup_field = 'pk'


#
#
#


# vendor retrieve serializer
class VendorRetrieveSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    certification_images = CertificationImageRetrieveSerializer(many=True, read_only=True)
    services = ServiceRetrieveSerializer(many=True, read_only=True)
    service_images = ServiceImageRetrieveSerializer(many=True, read_only=True)

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
            "status",

            # additional
            "certification_images",
            "services",
            "service_images",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

# vendor create serializer
class VendorCreateSerializer(serializers.ModelSerializer):
    certification_images = CertificationImageCreateSerializer(many=True, required=False)

    class Meta:
        model = Vendor
        fields = [
            "business_name",
            "address",
            "years_in_business",
            "certification_list",

            # additional field
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
            VendorCertificationImage.objects.create(vendor=vendor, image=image)

        return vendor

# vendor update serializer
class VendorUpdateSerializer(serializers.ModelSerializer):
    certification_images = CertificationImageCreateSerializer(many=True, required=False)

    class Meta:
        model = Vendor
        fields = [
            "business_name",
            "address",
            "years_in_business",
            "certification_list",
            
            # additional
            "certification_images",
        ]

    def update(self, instance, validated_data):
        request = self.context.get('request')
        certification_images_data = request.FILES.getlist("certification_images")

        # update basic vendor fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # if new certification images are provided, replace the old ones
        if certification_images_data:
            # delete old images
            VendorCertificationImage.objects.filter(vendor=instance).delete()

            # add new images
            for image in certification_images_data:
                VendorCertificationImage.objects.create(vendor=instance, image=image)

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



# vendor serializer for admin
class VendorAdminSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    certification_images = CertificationImageRetrieveSerializer(many=True)
    services = ServiceRetrieveSerializer(many=True)
    service_images = ServiceImageRetrieveSerializer(many=True)
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

            # changeable fields
            "status",
            "is_approved",

            # additional
            "certification_images",
            "services",
            "service_images",
        ]
        read_only_fields = [
            "id", 
            "user",
            "business_name",
            "address", 
            "created_at",
            "years_in_business",
            "certification_list",

            # additional
            "certification_images",
            "services",
            "service_images",
        ]

# vendor service serializer for admin
class ServiceAdminSerializer(serializers.ModelSerializer):
    specific_date_avail = SpecificDateAvailabilityRetrieveSerializer(many=True, read_only=True)
    recurring_avail = RecurringAvailabilityRetrieveSerializer(many=True, read_only=True)
    service_images = ServiceImageRetrieveSerializer(many=True, read_only=True)
    pricing = ServicePricingRetrieveSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "vendor",
            "service_name",
            "service_type",
            "location",
            "availability_start_date",
            "availability_end_date",
            "availability_type",
            "description",
            "created_at",
            "updated_at",
            # "main_image_url",
            "amenities",
            "service_quantity",
            "service_mode",

            # changeable fields
            "status",
            "is_approved",

            # additionl 
            "specific_date_avail",
            "recurring_avail",
            "service_images",
            "pricing",
        ]
        read_only_fields = [
            "id",
            "vendor",
            "service_name",
            "service_type",
            "location",
            "availability_start_date",
            "availability_end_date",
            "availability_type",
            "description",
            "created_at",
            "updated_at",
            "status",
            # "main_image_url",
            "amenities",
            "service_quantity",
            "service_mode",

            # additionl 
            "specific_date_avail",
            "recurring_avail",
            "service_images",
            "pricing"
        ]
