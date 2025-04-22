from rest_framework import generics
from .models import Vendor, VendorPackageImages, VendorPackage
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializer import VendorSerializer, VendorPackageImagesSerializer, VendorPackageSerializer
from rest_framework.views import APIView
from .availability import is_vendor_available

# vendor list and create view
class VendorListCreateView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # on creating
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# vendor detail view
class VendorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# vendor package create view
class VendorPackageListCreateView(generics.ListCreateAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # on creating
    def perform_create(self, serializer):
        serializer.save()  # to make sure frontend sends correct vendor_id

# vendor package detail view
class VendorPackageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# vendor image list create view
class VendorPackageImagesListCreateView(generics.ListCreateAPIView):
    queryset = VendorPackageImages.objects.all()
    serializer_class = VendorPackageImagesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # on creating
    def perform_create(self, serializer):
        serializer.save()  # Expecting vendor_id in the request

# vendor image detail view
class VendorPackageImagesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VendorPackageImages.objects.all()
    serializer_class = VendorPackageImagesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# checking vendor availabity view
class CheckingVendorAvailability(APIView):
    pass

