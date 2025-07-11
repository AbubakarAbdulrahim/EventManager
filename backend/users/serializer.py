from rest_framework import serializers
from django.contrib.auth import get_user_model
from bookings.serializer import BookingRetrieveSerializer
from .models import (
    UserEvent,
    Notification,
)

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
            "last_login",
            "avatar",
            "avatar_url",
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
            "last_login",
            "avatar",
            "avatar_url",
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
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            "full_name", 
            "username", 
            "email", 
            "phone_number",
            "avatar",
            "avatar_url",
        ]
        read_only_fields = [
            "avatar_url"
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # make fields not required
        if self.instance:
            for field in self.fields.values():
                field.required = False

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and hasattr(obj.avatar, 'url'):
            # full absolute URL if request is available
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            # fallback to relative URL
            return obj.avatar.url
        return None
    
    # update
    def update(self, instance, validated_data):
        avatar = validated_data.pop("avatar", None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if avatar is not None:
            instance.avatar = avatar
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



# track user event serializer
class UserEventCreateSerializer(serializers.Serializer):
    event_type = serializers.CharField()

    class Meta:
        model = UserEvent
        fields = [
            "event_type",
        ]

    def create(self, validated_data):
        return UserEvent.objects.create(**validated_data)

# user event retrieve serializer
class UserEventRetrieveSerializer(serializers.ModelSerializer):
    views = serializers.CharField()
    service = serializers.IntegerField()
    
    class Meta:
        model = UserEvent
        fields = [
            "views",
            "service",
        ]



#
#
#



# user notification serializer
class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = [
            "title",
            "message",
            "type",
            "category",
            "priority",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]



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