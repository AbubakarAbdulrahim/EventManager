from rest_framework import generics
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
