from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Booking
from .serializer import BookingSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .tasks import notify_venue, notify_admins, notify_user
from users.models import User

# helper func -> get admin emails
def get_admin_emails():
    return [admin.email for admin in User.objects.filter(role='admin')]

# helper func -> validate booking status
def validate_status_change(booking, invalid_statuses: list):
    return booking.status not in invalid_statuses

# detail view
class BookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # on deleting 
    def perform_destroy(self, instance):
        user = self.request.user 
        
        notify_admins(
            subject='Cancelled Booking',
            admin_emails=get_admin_emails(),
            message=f'{user.name} cancelled booking',
            sender_email='ourapp@email.com',
        )
        notify_venue(
            subject='Cancelled Booking',
            message=f'{user.name} cancelled booking',
            venue_email=instance.venue.email,
            sender_email='ourapp@email.com'
        )

        super().perform_destroy(instance)  

    
    # on updating
    def perform_update(self, serializer):
        booking = serializer.save()
        notify_user(
            sender_email='ourapp@gmail.com',
            message=f'Your booking at {booking.venue.name} has been updated.',
            subject='Booking Updated',
            user_email=booking.user.email
        )


# list create view
class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # on create
    def perform_create(self, serializer):
        user=self.request.user            
        booking = serializer.save(user= user, status="Pending")
        
        # notifying the venue by email
        notify_venue(
            venue_email= booking.venue.owner.email,
            subject= 'Booking Request',
            message= f'{user.name} request a booking',
            sender_email= 'ourapp@email.com',
        )
         
    # on querying
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=user)
    

# venue approved booking view
class ApprovedBookingView(APIView):
    permission_classes = [IsAuthenticated]

    # on post
    def post(self, request, booking_id):
        if request.user.role != "venue_owner":
            return Response({"message": "Invalid request"}, status=404)
        booking = get_object_or_404(Booking, id=booking_id, venue__owner=request.user) # get booking by existence
        if booking.status != "Pending":
            return Response({"message":"Booking is already processed!"}, status=400)
        booking.status = "Accepted"
        booking.save()

        # notify the admins
        notify_admins(
            sender_email='ourapp@gmail.com',
            message=f'A booking at {booking.venue.name} has been accepted by {request.user.name}.',
            subject='Booking Approved Notification',
            admin_emails= get_admin_emails()
        )
        # notify the user
        notify_user(
            sender_email='ourapp@gmail.com',
            message=f'Your booking at {booking.venue.name} has been accepted!',
            subject='Booking Approved',
            user_email=booking.user.email
        )
        return Response({"message": f"Booking accepted by {booking.venue.name} "})
    

# venue rejects booking view 
class RejectBookingView(APIView):
    permission_classes = [IsAuthenticated]

    # on post
    def post(self, request, booking_id):
        if request.user.role != "venue_owner":
            return Response({"message": "Invalid request"}, status=404)
        booking = get_object_or_404(Booking, id=booking_id, venue__owner=request.user)
        if not validate_status_change(booking, ["Confirmed", "Rejected", "Completed"]):
            return Response({"message": "Booking cannot be modified"}, status=400)
        booking.status = "Rejected"
        booking.save()

        # notify venue, user and admins
        notify_user(
            sender_email='ourapp@gmail.com',
            message=f'Sorry, your booking at {booking.venue.name} has been rejected.',
            subject='Booking Rejected',
            user_email=booking.user.email
        )
        notify_venue(
            sender_email='ourapp@gmail.com',
            message=f'{booking.venue.owner.name}, you have rejected a booking from {booking.user.name}.',
            subject='Booking Rejected Notification',
            venue_email=booking.venue.owner.email
        )
        notify_admins(
            sender_email='ourapp@gmail.com',
            message=f'A booking at {booking.venue.name} was rejected by {request.user.name}.',
            subject='Booking Rejected Notification',
            admin_emails= get_admin_emails()
        )
        return Response({"message": f"Booking for {booking.venue.name} has been successfully rejected."})
