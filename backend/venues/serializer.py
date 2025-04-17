from rest_framework import serializers
from .models import Venue

# venue serializer
class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"
        read_only_fields = ["owner"]