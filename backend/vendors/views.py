from rest_framework import generics
from .models import Vendor, VendorPackage
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializer import(
    VendorActualSerializer, 
    VendorDetailSerializer, 
    VendorPackageActualSerializer,
    VendorPackageDetailSerializer
)
from rest_framework.views import APIView
from .availability import is_vendor_package_available
from rest_framework.response import Response

# vendor list and create view
class VendorListCreateView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorActualSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # on creating
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# vendor detail view
class VendorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# vendor package list and create view
class VendorPackageListCreateView(generics.ListCreateAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageActualSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # on creating
    def perform_create(self, serializer):
        serializer.save()

# vendor package detail view
class VendorPackageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# checking vendor availabity view
class CheckingVendorAvailability(APIView):
    def post(self, request):
        package = request.context['vendor_package']
        event_date = request.context['event_date']
        start_time = request.context['start_time']
        end_time = request.context['end_time']

        if is_vendor_package_available(
            vendor_package=package,
            event_date = event_date,
            start_time=start_time,
            end_time=end_time
        ):
            return Response({"is_available":True})
        else:
            return Response({"is_available":False})
