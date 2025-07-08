from rest_framework import generics
from rest_framework.response import Response
from .models import Booking, Vendor, Service
from datetime import datetime, timedelta
from .serializer import (
    BookingCreateSerializer,
    BookingRetrieveSerializer,
    BookingUpdateSerializer,
    BookingDestroySerializer
)
from rest_framework.permissions import IsAuthenticated


class BookedSlotsView(generics.RetrieveAPIView):
    def get(self, request, date):
        service_id = request.GET.get("service_id")
        if not service_id:
            return Response({"error": "Missing service_id"}, status=400)

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({"error": "Invalid service_id"}, status=404)

        bookings = Booking.objects.filter(event_date=date, service=service)
        booked_slots = [
            {
                'start_time': booking.start_time.strftime('%H:%M'),
                'end_time': booking.end_time.strftime('%H:%M'),
            }
            for booking in bookings
        ]
        return Response({'booked_slots': booked_slots})

    

class CheckAvailabilityView(generics.RetrieveAPIView):
    def get(self, request):
        date_str = request.GET.get("date")
        start_time_str = request.GET.get("start_time")
        duration = int(request.GET.get("duration", 0))
        service_id = request.GET.get("service_id")

        if not date_str or not start_time_str or not duration or not service_id:
            return Response({"error": "Missing parameters"}, status=400)
        
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({"error": "Invalid service_id"}, status=404)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            time_obj = datetime.strptime(start_time_str, "%H:%M").time()
        except ValueError:
            return Response({"error": "Invalid date or time format"}, status=400)

        start_datetime = datetime.combine(date_obj, time_obj)
        end_datetime = start_datetime + timedelta(hours=duration)
        start_time = start_datetime.time()
        end_time = end_datetime.time()


        bookings = Booking.objects.filter(event_date=date_obj, service=service)
        for booking in bookings:
            if not (end_time <= booking.start_time or start_time >= booking.end_time):
                return Response({'available': False})
                
        return Response({'available': True})


# retrieve booking by id
class BookingRetrieveView(generics.RetrieveAPIView):
    serializer_class = BookingRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# create booking
class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# list bookings for a specific user
class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# list bookings for a specific vendor
class VendorBookingListView(generics.ListAPIView):
    serializer_class = BookingRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            vendor = Vendor.objects.get(user=self.request.user)
        except Vendor.DoesNotExist:
            return Booking.objects.none()
        return Booking.objects.filter(vendor=vendor)

# update booking by id
class BookingUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = BookingUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# delete booking by id
class BookingDestroyView(generics.DestroyAPIView):
    serializer_class = BookingDestroySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()






#
#
#
