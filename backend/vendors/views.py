from rest_framework import generics, status
from django.core.files.base import ContentFile
import base64
import re
from .models import (
    Vendor,
    VendorCertificationImage,
    Service,
    ServiceImage,
)
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .permission import IsVendorRole
from .serializer import(
    VendorCreateSerializer,
    VendorRetrieveSerializer,
    VendorUpdateSerializer,
    VendorDestroySerializer,
    ServiceCreateSerializer,
    ServiceRetrieveSerializer,
    ServiceUpdateSerializer,
)
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .availability import is_service_available


'''
views for vendors
'''

# vendor retrieve view
class VendorRetrieveView(generics.RetrieveAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

# vendor create view
class VendorCreateView(generics.CreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorCreateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    # on creating
    def perform_create(self, serializer):
        serializer.save()

# vendor update view
class VendorUpdateView(generics.UpdateAPIView):
    serializer_class = VendorUpdateSerializer
    permission_classes = [IsVendorRole]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user
        return Vendor.objects.filter(user=user) 
    
# vendor list view
class VendorListView(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

# vendor destroy view
class VendorDestroyView(generics.DestroyAPIView):
    serializer_class = VendorDestroySerializer
    lookup_field = 'pk'
    permission_classes = [IsVendorRole]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Vendor.objects.filter(user=self.request.user)

    # deleting all the inhabitants
    def perform_destroy(self, instance):
        VendorCertificationImage.objects.filter(vendor=instance).delete()
        Service.objects.filter(vendor=instance).delete()
        instance.delete()
        return instance


'''
for vendor service
'''

# vendor service list view
class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

# vendor service create view
class ServiceCreateView(generics.CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceCreateSerializer
    permission_classes = [IsVendorRole]
    parser_classes = [JSONParser, MultiPartParser]

    # on creating
    def perform_create(self, serializer):
        user = self.request.user
        vendor = Vendor.objects.get(user=user)
        if vendor:
            serializer.save(vendor=vendor)
        else:
            raise ValidationError("Vendor not found for this user.")

    def create(self, request, *args, **kwargs):
        print("RAW DATA:", request.data)
        return super().create(request, *args, **kwargs)
 
# vendor service retrieve view
class ServiceRetrieveView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  
    parser_classes = [MultiPartParser, FormParser]

# vendor service update view
class ServiceUpdateView(generics.UpdateAPIView):
    serializer_class = ServiceCreateSerializer
    permission_classes = [IsVendorRole]  
    parser_classes = [JSONParser]

    def get_queryset(self):
        vendor = Vendor.objects.get(user=self.request.user)
        return Service.objects.filter(vendor=vendor)
    
# service image update view
class ServiceImageUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsVendorRole]

    def post(self, request, service_id):
        service = Service.objects.get(id=service_id)
        if not service:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        files = request.FILES.getlist('service_images')

        if not files:
            return Response({"detail": "No images provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # delete the old instances
        ServiceImage.objects.filter(service=service).delete()

        # create new ServiceImage instances for each uploaded file
        for file in files:
            ServiceImage.objects.create(service=service, image=file)
        
        return Response({"detail": "Images updated successfully."}, status=status.HTTP_201_CREATED)
   


#
#
#


'''
for vendor service availability
'''

# service availability list view
class ServiceAvailabilityRetrievView(generics.RetrieveAPIView):
    # serializer_class = VendorPackageAvailability
    permission_classes = [IsAuthenticatedOrReadOnly]

    # def get_queryset(self):
    #     return VendorPackageAvailability.filter(is_available=True)
