from rest_framework import generics
from .models import Vendor, VendorImages, VendorPackage
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializer import VendorSerializer, VendorImageSerializer, VendorPackageSerializer

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
    queryset = Vendor
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
class VendorImageListCreateView(generics.ListCreateAPIView):
    queryset = VendorImages.objects.all()
    serializer_class = VendorImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # on creating
    def perform_create(self, serializer):
        serializer.save()  # Expecting vendor_id in the request

# vendor image detail view
class VendorImageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VendorImages.objects.all()
    serializer_class = VendorImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# # packages for a specific vendor
# class PackagesByVendorView(generics.ListAPIView):
#     serializer_class = VendorPackageSerializer

#     def get_queryset(self):
#         vendor_id = self.kwargs['vendor_id']
#         return VendorPackage.objects.filter(vendor_id=vendor_id)

# # images for a specific vendor
# class ImagesByVendorView(generics.ListAPIView):
#     serializer_class = VendorImageSerializer

#     def get_queryset(self):
#         vendor_id = self.kwargs['vendor_id']
#         return VendorImages.objects.filter(vendor_id=vendor_id)
