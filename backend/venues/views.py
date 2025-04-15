from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Venue
from .serializer import VenueSerializer


# list create view
class VenueListCreateView(generics.ListCreateAPIView):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [IsAuthenticated]

    # on create
    def perform_create(self, serializer):
        if serializer.is_valid():
           serializer.save(owner=self.request.user)
        print(serializer.errors)

# detail view
class VenueRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [IsAuthenticated]

    # on updating
    def perform_update(self, serializer):
        pass
    
    # on deleting
    def perform_destroy(self, instance):
        pass