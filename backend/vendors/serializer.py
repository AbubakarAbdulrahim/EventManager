from rest_framework import serializers
from users.serializer import UserSerializer
from .models import (
    Vendor,
    VendorCertificationImage,
    ServiceImage, 
    Service,
    ServiceSpecificDateAvailability,
    ServiceRecurringAvailability,
    ServicePricing,
    PricingPackage,
)
from django.contrib.auth import get_user_model

User = get_user_model()

# vendor certification image create serializer
class CertificationImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorCertificationImage
        fields =[
            # "id", 
            # "vendor", 
            "image",
            # "uploaded_at",
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

# vendor service image serializer (to be referenced)
class ServiceImageSerializer(serializers.ModelSerializer):
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

# service specific date availability serializer (to be referenced)
class SpecificDateAvailabilitySerializer(serializers.ModelSerializer):
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
            "service",
        ]

# service recurring availability serializer (to be referenced)
class RecurringAvailabilitySerializer(serializers.ModelSerializer):
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

# price package create serializer
class PricingPackageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPackage
        fields = [
            "id",
            "description",
            "price",
            "quantity_description",

            # additional
            "pricing_model",
        ]
    
# price package retrieve serializer
class PricingPackageRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPackage
        fields = [
            "id",
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
            # "id",
            "service",
            "model_type",
            "base_price",
            "is_active",

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
            "is_active",

            # additional
            "price_packages",
        ]


# 
# 
#


# service retrieve serializer
class ServiceRetrieveSerializer(serializers.ModelSerializer):
    specific_date_avail = SpecificDateAvailabilitySerializer(many=True, read_only=True)
    recurring_avail = RecurringAvailabilitySerializer(many=True, read_only=True)
    service_images = ServiceImageSerializer(many=True, read_only=True)
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
            "is_approved",

            # additionl 
            "specific_date_avail",
            "recurring_avail",
            "service_images",
            "pricing",
            ]
        read_only_fields = [
            "vendor",
        ]

# service create serializer
class ServiceCreateSerializer(serializers.ModelSerializer):
    specific_date_availability = SpecificDateAvailabilitySerializer(many=True, required=False)
    recurring_availability = RecurringAvailabilitySerializer(many=True, required=False)
    service_images = ServiceImageSerializer(many=True, required=False)
    pricing = ServicePricingCreateSerializer(many=True, required=False)
    
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

            # additional
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
        service_images = request.FILES.getlist('service_images')

        # validate that at least one availability type is provided
        if not date_avail and not recurring_avail:
            raise serializers.ValidationError(
                {"specific_date_availability or recurring_availability": "One of these fields must be filled."}
            )

        if not service_images:
            raise serializers.ValidationError({"package_images": "This field is required."})

        # create the main service
        service = Service.objects.create(**validated_data)

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
    specific_date_availability = SpecificDateAvailabilitySerializer(many=True, required=False)
    recurring_availability = RecurringAvailabilitySerializer(many=True, required=False)
    service_images = ServiceImageSerializer(many=True, required=False)
    pricing = ServicePricingCreateSerializer(many=True, required=False)

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

            # additional
            "specific_date_availability",
            "recurring_availability",
            "service_images",
            "pricing",
        ]

    def update(self, instance, validated_data):
        request = self.context.get('request')
        date_avail = validated_data.pop('specific_date_availability', [])
        recurring_avail = validated_data.pop('recurring_availability', [])
        price_data = validated_data.pop('pricing', [])
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
    user = UserSerializer(read_only=True)
    certification_images = CertificationImageRetrieveSerializer(many=True, read_only=True)
    services = ServiceRetrieveSerializer(many=True, read_only=True)
    service_images = ServiceImageSerializer(many=True, read_only=True)

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
            "services",
            "service_images",
        ]
        read_only_fields = [
            "created_at",
            "is_approved",
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
    user = UserSerializer()
    certification_images = CertificationImageRetrieveSerializer(many=True)
    services = ServiceRetrieveSerializer(many=True)
    service_images = ServiceImageSerializer(many=True)
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

# vendor package serializer for admin
class ServiceAdminSerializer(serializers.ModelSerializer):
    specific_date_avail = SpecificDateAvailabilitySerializer(many=True, read_only=True)
    recurring_avail = RecurringAvailabilitySerializer(many=True, read_only=True)
    service_images = ServiceImageSerializer(many=True, read_only=True)
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

            # additionl 
            "specific_date_avail",
            "recurring_avail",
            "service_images",
            "pricing"
        ]
