from rest_framework import generics, status
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
    ServiceDestroySerializer,
    ServiceImageDestroySerializer,
)
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.views import generic
import datetime
from django.contrib.auth import get_user_model
from decouple import config
from tasks.tasks import send_email_task
from .availability import is_service_available


User = get_user_model()

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
        vendor = serializer.save()
        template_prefix = 'vendor_application'
        context = {
            'vendor' : vendor,
            'current_year' : datetime.now().year,
            'review_days' : '1 to 3 days',
            'support_email' : config('EMAIL_HOST_USER'),
            'subject' : 'Vendor Application Notification!'
        }

        # send welcome email to a user
        send_email_task(
            subject='Welcome to Event Master!', 
            to_email=vendor.user.email, 
            context=context, 
            template_prefix=template_prefix
            )

# vendor update view
class VendorUpdateView(generics.UpdateAPIView):
    serializer_class = VendorUpdateSerializer
    permission_classes = [IsVendorRole]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user
        return Vendor.objects.filter(user=user)
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        vendor = Vendor.objects.get(user=request.user)
        recent_users = User.objects.filter(
            bookings__vendor=vendor
        ).distinct()

        template_prefix = 'vendor_profile_update'
        support_email = config('EMAIL_HOST_USER')

        context = {
            'current_year': datetime.now().year,
            'subject': 'Vendor Profile Update Notification',
            'vendor': vendor,
            'added_service': False,
            'update_profile': True,
            'vendor_profile_link': '/',
            'support_email': support_email,
        }

        for user in recent_users:
            context['user'] = user
            send_email_task(
                subject='Vendor Profile Update!',
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )
        
        return response

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
        
        response = super().create(request, *args, **kwargs)

        vendor = Vendor.objects.get(user=request.user)
        recent_users = User.objects.filter(
            bookings__vendor=vendor
        ).distinct()

        template_prefix = 'vendor_profile_update'
        support_email = config('EMAIL_HOST_USER')

        context = {
            'current_year': datetime.now().year,
            'subject': 'Vendor Service Addition Notification',
            'vendor': vendor,
            'added_service': True,
            'update_profile': False,
            'vendor_profile_link': '/',
            'support_email': support_email,
        }

        for user in recent_users:
            context['user'] = user
            send_email_task(
                subject='Vendor Profile Update!',
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )

        return response

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
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        vendor = Vendor.objects.get(user=request.user)
        recent_users = User.objects.filter(
            bookings__vendor=vendor
        ).distinct()

        template_prefix = 'vendor_profile_update'
        support_email = config('EMAIL_HOST_USER')

        context = {
            'current_year': datetime.now().year,
            'subject': 'Vendor Service Update Notification',
            'vendor': vendor,
            'added_service': False,
            'update_profile': True,
            'vendor_profile_link': '/',
            'support_email': support_email,
        }

        for user in recent_users:
            context['user'] = user
            send_email_task(
                subject='Vendor Profile Update!',
                to_email=user.email,
                context=context,
                template_prefix=template_prefix
            )
        
        return response

# vendor service destroy view
class ServiceDestroyView(generics.DestroyAPIView):
    serializer_class = ServiceDestroySerializer
    permission_classes = [IsVendorRole]
    lookup_field = 'pk'
    
    def get_queryset(self):
        vendor = Vendor.objects.get(user=self.request.user)
        return Service.objects.filter(vendor=vendor)
    
    def perform_destroy(self, instance):
        instance.delete()
        return instance


#
#
#



# service image update view
class ServiceImageUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsVendorRole]

    def post(self, request, service_id):
        service = get_object_or_404(Service, id=service_id)
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

# service image destroy view
class ServiceImageDestroyView(generics.DestroyAPIView):
    serializer_class = ServiceImageDestroySerializer
    permission_classes = [IsVendorRole]
    lookup_field = 'pk'

    def get_queryset(self):
        vendor = Vendor.objects.get(user=self.request.user)
        return Service.objects.filter(vendor=vendor)
    


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


'''
for email messages preview
'''

# welcome email view
class WelcomeEmailView(generic.TemplateView):
    template_name = 'welcome.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_year'] = datetime.datetime.now().year
        context['user'] = self.request.user
        context['dashboard_url'] = '/'
        context['subject'] = 'Welcome to Event Master!'
        

        return context
    
# password reset email view
class PasswordResetEmailView(generic.TemplateView):
    template_name = 'password_reset.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_year'] = datetime.datetime.now().year
        context['user'] = self.request.user
        context['password_reset_link'] = '/'
        context['subject'] = 'Reset Your Password!'
        context['duration'] = '1 hour'

        return context
    

# profile update email view
class VendorProfileUpdateEmailView(generic.TemplateView):
    template_name = 'Vendor_profile_update.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['current_year'] = datetime.datetime.now().year
        context['vendor'] = '/vendor/' 
        context['subject'] = 'Vendor Profile Update Notification'
        context['profile_link'] = '/'
        context['added_service'] = True
        context['support_email'] = config('EMAIL_HOST_USER')


        return context
    

# request denial email view
class RequestDenialEmailView(generic.TemplateView):
    template_name = 'request_denial.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_year'] = datetime.datetime.now().year
        context['user'] = self.request.user
        context['support_email'] = 'our_email@gmail.com'

        return context
    

# vendor application email view
class VendorApplicationEmailView(generic.TemplateView):
    template_name = 'vendor_application.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['current_year'] = datetime.datetime.now().year
        context['vendor'] = '/vendor/'
        context['support_email'] = config('EMAIL_HOST_USER'),
        context['subject'] = 'Vendor Application Notification!'
        context['review_days'] = '1 to 3 days'

        return context