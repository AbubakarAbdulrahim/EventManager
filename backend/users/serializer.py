from rest_framework import serializers
from django.contrib.auth import get_user_model
from bookings.serializer import BookingRetrieveSerializer


User = get_user_model()

# user profile serializer (retrieve)
class UserProfileSerializer(serializers.ModelSerializer):
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
        ] 
        read_only_fields = [
            "id", 
            "full_name", 
            "username", 
            "email", 
            "role", 
            "phone_number", 
            "is_active",
            "date_joined"
        ]
        
# user create serializer
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name", 
            "username", 
            "email", 
            "phone_number",
            "password", 
        ]
        extra_kwargs = {
            "password" : {"write_only" : True}
        }

    # create
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, role='customer', **validated_data)
        return user

# user update serializer
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name", 
            "username", 
            "email", 
            "phone_number",
        ]
    
    # update
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# password change serializer
class PasswordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password']
        extra_kwargs = {
            "password" : {"write_only" : True}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance.set_password(password)
        instance.save()
        return instance
    
# user destroy serializer
class UserDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']
        lookup_field = 'pk'


#
#
#


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