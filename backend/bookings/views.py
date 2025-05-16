from rest_framework import generics
from .models import Booking
from .serializer import (
    BookingCreateSerializer,
    BookingRetrieveSerializer,
    BookingUpdateSerializer,
    BookingDestroySerializer
)
from rest_framework.permissions import IsAuthenticated


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
        vendor_id = self.request.query_params.get('vendor_id')
        return Booking.objects.filter(vendor_id=vendor_id)

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
