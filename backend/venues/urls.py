from django.urls import path
from .views import VenueListCreateView, VenueRetrieveUpdateDestroyView

urlpatterns = [
    path('', VenueListCreateView.as_view(), name='venue_list_create'),  # list create
    path('<int:pk>/', VenueRetrieveUpdateDestroyView.as_view(), 
         name='venue_retrieve_update_destroy'),  # detail
]