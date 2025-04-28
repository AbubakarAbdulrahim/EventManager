from rest_framework import generics
from .models import (
    Vendor, 
    VendorPackage, 
    VendorCertificationImages, 
    VendorPackageImages,
    VendorPackageAvailability
)
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .permission import IsVendorRole
from .serializer import(
    VendorCreateSerializer,
    VendorRetrieveSerializer,
    VendorUpdateSerializer,
    VendorDestroySerializer,
    VendorPackageCreateSerializer,
    VendorPackageRetrieveSerializer,
    )
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError


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
    permission_classes = [AllowAny]
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
    queryset = Vendor.objects.all()
    serializer_class = VendorDestroySerializer
    lookup_field = 'pk'
    permission_classes = [IsVendorRole]
    parser_classes = [MultiPartParser, FormParser]

    # deleting all the inhabitants
    def perform_destroy(self, instance):
        VendorCertificationImages.objects.filter(vendor=instance).delete()
        instance.delete()
        return instance


'''
for vendor package
'''

# vendor package list view
class VendorPackageListView(generics.ListAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

# vendor package create view
class VendorPackageCreateView(generics.CreateAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageCreateSerializer
    permission_classes = [IsVendorRole]
    parser_classes = [MultiPartParser, FormParser]

    # on creating
    def perform_create(self, serializer):
        user = self.request.user
        vendor = Vendor.objects.get(user=user)
        if vendor:
            serializer.save(vendor=vendor)
        else:
            raise ValidationError("Vendor not found for this user.")

# vendor package retrieve view
class VendorPackageRetrieveView(generics.RetrieveAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  
    parser_classes = [MultiPartParser, FormParser]

# vendor package update view
class VendorPackageUpdateView(generics.UpdateAPIView):
    serializer_class = VendorPackageCreateSerializer
    permission_classes = [IsVendorRole]  
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        vendor = Vendor.objects.get(user=self.request.user)
        return VendorPackage.objects.filter(vendor=vendor)
    
# vendor package destroy view
class VendorPackageDestroyView(generics.DestroyAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageCreateSerializer
    permission_classes = [IsVendorRole]
    parser_classes = [MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        VendorPackageImages.objects.filter(vendor_package=instance).delete()
        VendorPackageAvailability.objects.filter(vendor_package=instance).delete()
        instance.delete()
        return instance


#
#
#


# checking vendor availabity view
class CheckingVendorAvailability(APIView):
    # def post(self, request):
    #     package = request.context['vendor_package']
    #     event_date = request.context['event_date']
    #     start_time = request.context['start_time']
    #     end_time = request.context['end_time']

    #     if is_vendor_package_available(
    #         vendor_package=package,
    #         event_date = event_date,
    #         start_time=start_time,
    #         end_time=end_time
    #     ):
    #         return Response({"is_available":True})
    #     else:
    #         return Response({"is_available":False})
    pass