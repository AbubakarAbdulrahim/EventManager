from rest_framework import serializers
from .models import Vendor, VendorImages, VendorPackage
from django.contrib.auth import get_user_model

User = get_user_model()

# vendor info serializer
class VendorSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField() # to readable string
    class Meta:
        model = Vendor
        Fields = [
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
            "is_available"
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
            "contact"
        ]
        extra_kwargs = {
            "created_at" : {"read_only" : True}
        }