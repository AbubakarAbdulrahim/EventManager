from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()  # gettting current user model

# user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # serializer model
        fields = ("id", "username", "password", "full_name", "email") # serializer fields
        extra_kwargs = {
            "username" : {"required" : True},
            "full_name" : {"required" : True},
            "password": {"write_only" : True}, # write only password
            "role" : {"read_only" : True} # read only role
        }

    # on creating the serializer
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) # create user
        validated_data.pop('date_joined', None) # remove date_joined
        if user.role != "Vendor":
            user.role = "Customer" # set default role
        user.save() # save the changes 
        return user
    