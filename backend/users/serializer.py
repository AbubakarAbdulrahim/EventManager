from rest_framework import serializers
from django.contrib.auth import get_user_model
from bookings.serializer import BookingRetrieveSerializer


User = get_user_model()

# user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", 
            "full_name", 
            "username", 
            "email", 
            "password", 
            "role", 
            "phone_number", 
            "is_active",
            "date_joined",
        ] 
        read_only_fields = [
            "role",
            "is_active",
            "date_joined",
        ]
        extra_kwargs = {
            "password": {"write_only" : True},
        }

    # on creating
    def create(self, validated_data):
        full_name = validated_data['full_name']
        username = validated_data['username']
        email = validated_data['email']
        phone_number = validated_data['phone_number']
        password = validated_data['password']
        role = 'customer'  # default role
        user = User.objects.create_user(
            full_name=full_name,
            username=username,
            email=email,
            password=password,
            role=role,
            phone_number=phone_number
        )
        # welcome email
        
        validated_data.pop('date_joined', None) # remove date_joined
        return user

# user serializer for admin
class UserAdminSerializer(serializers.ModelSerializer):
    bookings = BookingRetrieveSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            "id", 
            "full_name", 
            "username", 
            "email",
            "role", 
            "phone_number", 
            "is_active",
            "date_joined",

            # additional field
            "bookings",
        ]
        read_only_fields = [
            "id", 
            "full_name", 
            "username", 
            "email",  
            "role", 
            "phone_number", 
            "is_active",
            "date_joined",

            # additional field
            "bookings",
        ]