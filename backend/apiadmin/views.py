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
# handling listing bookings
class BookingsAdminListView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving and destroying bookings
class BookingsAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingAdminSerializer
    permission_classes = [IsAdminRole]


#
#
#


'''  for managing vendors  '''
# handling listing vendors
class VendorAdminListView(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving and destroying vendors
class VendorAdminDetailView(generics.RetrieveDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating vendors
class VendorAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        action = request.data.get('action')
        vendor = get_object_or_404(Vendor, pk=pk)

        if action == 'approve':
            vendor.is_approved = True
            vendor.user.role = 'vendor'
            vendor.user.save()
            message = 'approved'

        elif action == 'suspend':
            vendor.is_approved = False

            if vendor.user.role == 'vendor':
                vendor.user.role = 'customer'
                vendor.user.save()
                message = 'suspended'
                
        vendor.save()
        return Response({"detail": f"vendor {message}"})


#
#
#



'''  for managing vendor services  '''
# handling listing vendor services
class ServiceAdminListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceAdminSerializer
    permission_classes = [IsAdminRole]

# handling retreiving and destroying vendor services
class ServiceAdminDetailView(generics.RetrieveDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceAdminSerializer
    permission_classes = [IsAdminRole]

# handling suspending and activating vendor services
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


#
#
#


'''  for managing transactions  '''
# handling listing transactions
class TransactionsAdminListView(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving and destroying transactions
class TransactionsAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionAdminSerializer
    permission_classes = [IsAdminRole]


#
#
#



'''  for managing users  '''
# handling linsting  users
class UsersAdminListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]

# handling retrieving and destroying users
class UsersAdminDetailView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        return User.objects.filter(role='customer')

# handling suspending and approving user
class UsersAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        if user.is_active == False:
            user.is_active = True
            user.save()
            message = 'approved'
        elif user.is_active == True:
            user.is_active == False
            user.save()
            message = 'suspended'
        user.save()
        return Response({"detail": f"user {message} successfully"})