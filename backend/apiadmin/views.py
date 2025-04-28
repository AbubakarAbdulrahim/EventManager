from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .permissions import IsAdminRole
from vendors.models import Vendor, VendorPackage
from vendors.serializer import VendorAdminSerializer, VendorPackageAdminSerializer
from bookings.models import Booking
from bookings.serializer import BookingAdminSerializer
from transactions.models import Transaction
from transactions.serializer import TransactionAdminSerializer
from users.models import User
from users.serializer import UserAdminSerializer


'''  for managing bookings  '''
# handling listing and creating bookings
class BookingsAdminListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving, updating and destroying bookings
class BookingsAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingAdminSerializer
    permission_classes = [IsAdminRole]


'''  for managing vendors  '''
# handling listing and creating vendors
class VendorsAdminListCreateView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving, updating, and destroying vendors
class VendorsAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating vendors
class VendorsAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        vendor = get_object_or_404(Vendor, pk=pk)
        if vendor.is_approved == False:
            vendor.is_approved = True
            vendor.user.role = 'vendor'
            message = 'approved'
        elif vendor.is_approved == True:
            vendor.is_approved == False
            if vendor.user.role == 'vendor':
                vendor.user.role = 'customer'
            message = 'suspended'
        vendor.save()
        return Response({"detail": f"vendor {message}"})


'''  for managing vendor packages  '''
# handling listing and creating vendor packages
class VendorPackagesAdminListCreateView(generics.ListCreateAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageAdminSerializer
    permission_classes = [IsAdminRole]

# handling retreiving, updating and destroying vendor packages
class VendorPackagesAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VendorPackage.objects.all()
    serializer_class = VendorPackageAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating vendor packages
class VendorPackagesAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        vendor_package = get_object_or_404(VendorPackage, pk=pk)
        if vendor_package.is_approved == False:
            vendor_package.is_approved = True
            message = 'approved'
        elif vendor_package.is_approved == True:
            vendor_package.is_approved == False
            message = 'suspended'
        vendor_package.save()
        return Response({"detail": f"vendor service {message} successfully"})



'''  for managing transactions  '''
# handling linsting and creationg transactions
class TransactionsAdminListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving, updating and destroying transactions
class TransactionsAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionAdminSerializer
    permission_classes = [IsAdminRole]


'''  for managing users  '''
# handling linsting and creationg users
class UsersAdminListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving, updating and destroying users
class UsersAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating user
class UsersAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        if user.is_active == False:
            user.is_active = True
            message = 'approved'
        elif user.is_active == True:
            user.is_active == False
            message = 'suspended'
        return Response({"detail": f"user {message} successfully"})