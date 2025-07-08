from rest_framework import generics, status
from .models import (
    Vendor,
    VendorCertificationImage,
    Service,
    ServiceImage,
    ServiceRecurringAvailability,
    ServiceSpecificDateAvailability
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
    RecurringAvailabilityCreateSerializer,
    RecurringAvailabilityRetrieveSerializer,
    SpecificDateAvailabilityCreateSerializer,
    SpecificDateAvailabilityRetrieveSerializer
)
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.response import Response
from django.views import generic
import datetime
from django.contrib.auth import get_user_model
from decouple import config
from tasks.tasks import send_email_task
# from .availability import is_service_available


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

        template_prefix = 'vendor_emails/vendor_application'
        context = {
            'vendor_username' : vendor.user.username,
            'current_year' : datetime.datetime.now().year,
            'review_days' : '1 to 3 days',
            'support_email' : config('EMAIL_HOST_USER'),
            'subject' : 'Vendor Application Notification!'
        }

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
        
        # vendor = Vendor.objects.get(user=request.user)
        
        # recent_users = User.objects.filter(
        #     bookings__vendors=vendor
        # ).distinct()

        # template_prefix = 'vendor_emails/vendor_profile_update'
        # support_email = config('EMAIL_HOST_USER')

        # context = {
        #     'current_year': datetime.datetime.now().year,
        #     'subject': 'Vendor Profile Update Notification',
        #     'vendor_username': vendor.user.username,
        #     'added_service': False,
        #     'update_profile': True,
        #     'vendor_profile_link': '/',
        #     'support_email': support_email,
        # }

        # for user in recent_users:
        #     context['user_username'] = user.username
        #     send_email_task(
        #         subject='Vendor Profile Update!',
        #         to_email=user.email,
        #         context=context,
        #         template_prefix=template_prefix
        #     )
        
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

        # vendor = Vendor.objects.get(user=request.user)
        
        # recent_users = User.objects.filter(
        #     bookings__vendor=vendor
        # ).distinct()

        # template_prefix = 'vendor_emails/vendor_profile_update'
        # support_email = config('EMAIL_HOST_USER')

        # context = {
        #     'current_year': datetime.datetime.now().year,
        #     'subject': 'Vendor Service Addition Notification',
        #     'vendor_username': vendor.user.username,
        #     'vendor_business_name' : vendor.business_name,
        #     'added_service': True,
        #     'update_profile': False,
        #     'vendor_profile_link': '/',
        #     'support_email': support_email,
        # }

        # for user in recent_users:
        #     context['user_username'] = user.username
        #     send_email_task(
        #         subject='Vendor Profile Update!',
        #         to_email=user.email,
        #         context=context,
        #         template_prefix=template_prefix
        #     )

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
        
        # vendor = Vendor.objects.get(user=request.user)
        
        # recent_users = User.objects.filter(
        #     bookings__vendors=vendor
        # ).distinct()

        # template_prefix = 'vendor_emails/vendor_profile_update'
        # support_email = config('EMAIL_HOST_USER')

        # context = {
        #     'current_year': datetime.datetime.now().year,
        #     'subject': 'Vendor Service Update Notification',
        #     'vendor_username': vendor.user.username,
        #     'vendor_business_name' : vendor.business_name,
        #     'added_service': False,
        #     'update_profile': True,
        #     'vendor_profile_link': '/',
        #     'support_email': support_email,
        # }

        # for user in recent_users:
        #     context['user_username'] = user.username
        #     send_email_task(
        #         subject='Vendor Profile Update!',
        #         to_email=user.email,
        #         context=context,
        #         template_prefix=template_prefix
        #     )
        
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


# service availability lisst view
class ServiceAvailabilityListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'service_id'

    def get_queryset(self):
        service_id = self.kwargs.get('service_id')
        availability_type = self.request.query_params.get('availability_type')

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            raise NotFound("Service not found")

        if availability_type == 'recurring':
            return ServiceRecurringAvailability.objects.filter(service=service)
        elif availability_type == 'specific_date':
            return ServiceSpecificDateAvailability.objects.filter(service=service)
        
        return ServiceRecurringAvailability.objects.none()

    def get_serializer_class(self):
        method = self.request.method
        availability_type = self.request.data.get('availability_type') if method in ['PUT', 'PATCH'] else self.request.query_params.get('availability_type')
   
        if availability_type == 'recurring':
            return RecurringAvailabilityRetrieveSerializer
        elif availability_type == 'specific_date':
            return SpecificDateAvailabilityRetrieveSerializer

        return super().get_serializer_class()
    
    def get_object(self):
        service_id = self.kwargs.get('service_id')
        availability_type = self.request.query_params.get('availability_type')

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            raise NotFound("Service not found")

        if availability_type == 'recurring':
            try:
                return ServiceRecurringAvailability.objects.get(service=service)
            except ServiceRecurringAvailability.DoesNotExist:
                raise NotFound("No recurring availability found")
        elif availability_type == 'specific_date':
            try:
                return ServiceSpecificDateAvailability.objects.get(service=service)
            except ServiceSpecificDateAvailability.DoesNotExist:
                raise NotFound("No specific date availability found")

        raise NotFound("Invalid availability type")

# service availability update view
class ServiceAvailabilityBulkUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        service_id = self.kwargs.get('service_id')
        availability_type = self.request.query_params.get('availability_type')

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            raise NotFound("Service not found")

        if availability_type == 'recurring':
            return ServiceRecurringAvailability.objects.filter(service=service)
        elif availability_type == 'specific_date':
            return ServiceSpecificDateAvailability.objects.filter(service=service)
        
        return ServiceRecurringAvailability.objects.none()


    def put(self, request, service_id):
        availability_type = request.data.get('availability_type')
        availabilities = request.data.get('availabilities', [])

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({'detail': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)

        if availability_type == 'recurring':
            ServiceRecurringAvailability.objects.filter(service=service).delete()
            new_instances = []
            for item in availabilities:
                new_instances.append(ServiceRecurringAvailability(
                    service=service,
                    day_of_the_week=item.get('day_of_the_week'),
                    start_time=item.get('start_time'),
                    end_time=item.get('end_time'),
                    is_booked=item.get('is_booked', False)
                ))
            ServiceRecurringAvailability.objects.bulk_create(new_instances)
            serializer = RecurringAvailabilityRetrieveSerializer(new_instances, many=True)

        elif availability_type == 'specific_date':
            ServiceSpecificDateAvailability.objects.filter(service=service).delete()
            new_instances = []
            for item in availabilities:
                new_instances.append(ServiceSpecificDateAvailability(
                    service=service,
                    date=item.get('date'),
                    start_time=item.get('start_time'),
                    end_time=item.get('end_time'),
                    is_booked=item.get('is_booked', False)
                ))
            ServiceSpecificDateAvailability.objects.bulk_create(new_instances)
            serializer = SpecificDateAvailabilityRetrieveSerializer(new_instances, many=True)

        else:
            return Response({'detail': 'Invalid availability type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)



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



''' for users email preview '''

# welcome email view
class WelcomeEmailView(generic.TemplateView):
    template_name = 'user_emails/welcome.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_year'] = datetime.datetime.now().year
        context['user'] = self.request.user
        context['dashboard_url'] = '/'
        context['subject'] = 'Welcome to Event Master!'
        

        return context
    
# password reset email view
class PasswordResetEmailView(generic.TemplateView):
    template_name = 'user_emails/password_reset.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_year'] = datetime.datetime.now().year
        context['user'] = self.request.user
        context['password_reset_link'] = '/'
        context['subject'] = 'Reset Your Password!'
        context['duration'] = '1 hour'

        return context


''' for vendors email previews '''

# profile update email view
class VendorProfileUpdateEmailView(generic.TemplateView):
    template_name = 'vendor_emails/vendor_profile_update.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['current_year'] = datetime.datetime.now().year
        context['vendor'] = '/vendor/' 
        context['subject'] = 'Vendor Profile Update Notification'
        context['profile_link'] = '/'
        context['added_service'] = True
        context['support_email'] = config('EMAIL_HOST_USER')


        return context
    
# vendor request status email view
class VendorRequestStatusEmailView(generic.TemplateView):
    template_name = 'vendor_emails/vendor_request_status.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_year'] = datetime.datetime.now().year
        context['user'] = self.request.user
        context['support_email'] = config('EMAIL_HOST_USER')
        context['status'] = 'approved'
 
        return context
    
# vendor application email view
class VendorApplicationEmailView(generic.TemplateView):
    template_name = 'vendor_emails/vendor_application.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['current_year'] = datetime.datetime.now().year
        context['vendor'] = '/vendor/'
        context['support_email'] = config('EMAIL_HOST_USER')
        context['subject'] = 'Vendor Application Notification!'
        context['review_days'] = '1 to 3 days'

        return context
    

''' for bookings email previews'''

# new booking email view
class NewBookingEmailView(generic.TemplateView):
    template_name = 'booking_emails/new_booking_alert.html'
        
# booking confirmed email view
class BookingConfirmedEmailView(generic.TemplateView):
    template_name = 'booking_emails/booking_confirmed.html'

# booking canellation email view
class BookingCancelledEmailView(generic.TemplateView):
    template_name = 'booking_emails/booking_cancelled.html' 


''' other email previews '''

# event reminder email view
class EventReminderEmailView(generic.TemplateView):
    template_name = 'other_emails/event_reminder.html'

# leave a review email view
class LeaveReviewEmailView(generic.TemplateView):
    template_name = 'other_emails/review.html'

# new message email view
class NewMessageEmailView(generic.TemplateView):
    template_name = 'other_emails/new_message.html'


