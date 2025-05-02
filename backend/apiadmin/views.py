from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .permissions import IsAdminRole
from vendors.models import Vendor, Service
from vendors.serializer import VendorAdminSerializer, ServiceAdminSerializer
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
class VendorAdminListCreateView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving, updating, and destroying vendors
class VendorAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating vendors
class VendorAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        vendor = get_object_or_404(Vendor, pk=pk)
        if vendor.is_approved == False:
            vendor.is_approved = True
            vendor.user.role = 'vendor'
            vendor.user.save()
            message = 'approved'

        elif vendor.is_approved == True:
            vendor.is_approved = False

            if vendor.user.role == 'vendor':
                vendor.user.role = 'customer'
                vendor.user.save()
                message = 'suspended'
                
        vendor.save()
        return Response({"detail": f"vendor {message}"})


'''  for managing vendor packages  '''
# handling listing and creating vendor packages
class ServiceAdminListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceAdminSerializer
    permission_classes = [IsAdminRole]

# handling retreiving, updating and destroying vendor packages
class ServiceAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating vendor packages
class ServiceAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        service = get_object_or_404(Service, pk=pk)
        if service.is_approved == False:
            service.is_approved = True
            message = 'approved'
        elif service.is_approved == True:
            service.is_approved == False
            message = 'suspended'
        service.save()
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