from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from vendors.permission import IsVendorRole
from .models import Booking
from .serializer import (
    BookingCreateSerializer,
    BookingRetrieveSerializer,
    BookingUpdateSerializer,
    BookingDestroySerializer
)
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

# helper func -> get admin emails
# def get_admin_emails():
#     return [admin.email for admin in User.objects.filter(role='admin')]

# helper func -> validate booking status
# def validate_status_change(booking, invalid_statuses: list):
#     return booking.status not in invalid_statuses

# booking retrieve view
class BookingRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingRetrieveSerializer
    permission_classes = [IsAuthenticated]

# booking create view
class BookingCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# booking list view
class BookingListView(generics.ListCreateAPIView):
    serializer_class = BookingRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# booking update view
class BookingUpdateView(generics.ListCreateAPIView):
    serializer_class = BookingUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# booking delete view
class BookingDestroyView(generics.DestroyAPIView):
    serializer_class = BookingDestroySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()
        return instance


#
#
#


# venue approved booking view
class ApprovedBookingView(APIView):
    permission_classes = [IsVendorRole]

    # on post
    def post(self, request, booking_id):
        if request.user.role != "vendor":
            return Response({"message": "Invalid request"}, status=404)
        booking = get_object_or_404(Booking, id=booking_id, vendor_package__vendor=request.user) # get booking by existence
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
        if request.user.role != "vendor":
            return Response({"message": "Invalid request"}, status=404)
        booking = get_object_or_404(Booking, id=booking_id, vendor_package__vendor=request.user)
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
