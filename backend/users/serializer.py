from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()  # gettting current user model

# user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # serializer model
        fields = ("id", "full_name", "username", "email", "password", "role" ) # serializer fields
        extra_kwargs = {
            "role" : {"read_only": True},
            "password": {"write_only" : True}, # write only password
        }

    # on creating
    def create(self, validated_data):
        full_name = validated_data['full_name']
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        role = 'customer'  # default role
        user = User.objects.create_user(
            full_name=full_name,
            username=username,
            email=email,
            password=password,
            role=role
        ) # create user
        validated_data.pop('date_joined', None) # remove date_joined
        return user
    