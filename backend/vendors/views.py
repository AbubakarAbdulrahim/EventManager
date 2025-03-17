from rest_framework import generics, permissions
from .models import Vendors
from .serializers import VendorsSerializer

#  Vendor List & Create
class VendorListCreate(generics.ListCreateAPIView):
    queryset = Vendors.objects.all()
    serializer_class = VendorsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#  Vendor Retrieve, Update & Delete
class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendors.objects.all()
    serializer_class = VendorsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
