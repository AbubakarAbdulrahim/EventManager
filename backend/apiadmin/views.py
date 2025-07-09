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
from tasks.tasks import send_email_task
from decouple import config



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

# handling suspending, approving and rejecting vendor accounts
class VendorAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        action = request.data.get('action')
        vendor = get_object_or_404(Vendor, pk=pk)
        
        user = vendor.user
        context = {
            'user_username' : user.username,
            'support_email' : config('EMAIL_HOST_USER')
        }
        template_prefix = 'vendor_emails/vendor_request_status'
        subject = 'Vendor Application Status'

        if action == 'approve':

            vendor.is_approved = True
            vendor.user.role = 'vendor'
            vendor.status = 'approved'
            vendor.user.save()
            message = 'approved'
            vendor.save()

            context['status'] = 'approved'
            send_email_task(
                subject=subject,
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )

        elif action == 'suspend':

            vendor.is_approved = False
            vendor.user.role = 'customer'
            vendor.status = 'suspended'
            vendor.user.save()
            message = 'suspended'
            vendor.save()

            context['status'] = 'suspended'
            send_email_task(
                subject=subject,
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )
        
        elif action == 'reject':

            vendor.is_approved = False
            vendor.user.role = 'customer'
            vendor.status = 'rejected'
            message = 'rejected'
            vendor.save()

            context['status'] = 'rejected'
            send_email_task(
                subject=subject,
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )

        return Response({"detail": f"vendor {message}"})



#
#
## vendor = Vendor.objects.get(service=service)
        # context = {
        #     'vendor_username' : vendor.user.username,
        #     'service_name' : service.service_name,
        #     'vendor_dashboard_url' : '/',
        #     'support_email' : config('EMAIL_HOST_USER')
        # }
        # template_prefix = 'service_emails/service_request_status'
        # subject = 'Service Listing Status'





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
        action = request.data.get('action')
        
        if action == 'approve':

            service.is_approved = True
            service.status = 'approved'
            message = 'approved'
            service.save()

        elif action == 'suspend':

            service.is_approved = False
            service.status = 'suspended'
            message = 'suspended'
            service.save()

        
        elif action == 'reject':

            service.is_approved = False
            service.status = 'rejected'
            message = 'rejected'
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
    serializer_class = UserAdminSerializer
    # permission_classes = [IsAdminRole]
    
    def get_queryset(self):
        return User.objects.filter(role='customer')

# handling retrieving and destroying users
class UsersAdminDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        return User.objects.filter(role='customer')

# handling suspending and approving user
class UsersAdminSuspendActivateView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        
        context = {
            'username' : user.username,
            'support_email' : config('EMAIL_HOST_USER'),
            'suspension_reason' : '',
            'login_url' : '/'

        }
        template_prefix = 'user_emails/user_request_status'
        subject = 'User Accounr Status'
        
        if user.is_active == False:
            user.is_active = True
            user.save()
            message = 'approved'
            
            context['is_suspended'] = False
            send_email_task(
                subject=subject,
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )

        elif user.is_active == True:
            user.is_active = False
            user.save()
            message = 'suspended'

            context['is_suspended'] = True
            send_email_task(
                subject=subject,
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )

        return Response({"detail": f"user {message} successfully"})