from rest_framework import generics
from .models import Booking
from .serializer import BookingSerializer
from rest_framework.permissions import IsAuthenticated

# to get a single booking, update or delete
class BookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # what happens on deleting
    def perform_destroy(self, instance):
        pass
    
    # what happens on update
    def perform_update(self, serializer):
        pass


# to list / create booking
class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # override the create method to forward the data to the admin
    def perform_create(self, serializer):
        if serializer.is_valid():            
            serializer.save(user=self.request.user, status="Pending")
        else:
            print(serializer.errors)

    # override a query method -> return bookings for a specific user
    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(user=user)