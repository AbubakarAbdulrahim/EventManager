from rest_framework import generics
from .models import Vendor, VendorPackage, VendorCertificationImages, VendorPackageImages
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permission import IsVendorRole
from .serializer import(
    VendorCreateSerializer,
    VendorRetrieveSerializer, 
    VendorPackageCreateSerializer,
    VendorPackageRetrieveSerializer
)
from rest_framework.views import APIView
from .availability import is_vendor_package_available
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser


'''
views for vendors
'''
# vendor list and create view
class VendorListCreateView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorCreateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    
    # def post(self, request, *args, **kwargs):
    #     data = {
    #         "business_name" : request.data.get("business_name"),
    #         "address" : request.data.get("address"),
    #         "years_in_business" : request.data.get("years_in_business"),
    #         "certification_list" : request.data.get("certification_list"),
    #     }

    #     vendor_serializer = self.get_serializer(data=data)
    #     vendor_serializer.is_valid(raise_exception=True)
    #     vendor = vendor_serializer.save(user=request.user)

    #     images = request.FILES.getlist("certification_images")
    #     if images:
    #         for image in images:
    #             VendorCertificationImages.objects.create(vendor=vendor, image=image)
    #     return Response(self.get_serializer(vendor).data, status=status.HTTP_201_CREATED)

    # on creating
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# vendor detail view
class VendorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


'''
for vendor package
'''
# vendor package list view
class VendorPackageListView(generics.ListAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# vendor package create view
class VendorPackageCreateView(generics.CreateAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageCreateSerializer
    permission_classes = [IsVendorRole]

    # def post(self, request, *args, **kwargs):
    #     data = {
    #         "service_name" : request.data.get("service_name"),
    #         "service_type" : request.data.get("service_type"),
    #         "service_mode" : request.data.get("service_mode"), 
    #         "capacity" : request.data.get("capacity"), 
    #         "price" : request.data.get("price"),
    #         "location" : request.data.get("location"),
    #         "availability" : request.data.get("availability")
    #     }

    #     vendor_package_serializer = self.get_serializer(data=data)
    #     vendor_package_serializer.is_valid(raise_exception=True)
    #     vendor = vendor_package_serializer.save(user=request.user)

    #     images = request.FILES.getlist("package_images")
    #     if images:
    #         for image in images:
    #             VendorPackageImages.objects.create(vendor=vendor, image=image)
    #     return Response(self.get_serializer(vendor).data, status=status.HTTP_201_CREATED)

    # on creating
    def perform_create(self, serializer):
        serializer.save()

# vendor package retrieve view
class VendorPackageRetrieveView(generics.RetrieveAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageRetrieveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  

# vendor package update view
class VendorPackageUpdateView(generics.UpdateAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageCreateSerializer
    permission_classes = [IsVendorRole]  

# vendor package destroy view
class VendorPackageDestroyView(generics.DestroyAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageCreateSerializer
    permission_classes = [IsVendorRole]  






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