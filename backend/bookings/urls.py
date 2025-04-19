from django.urls import path
from .views import BookingListCreateView, BookingRetrieveUpdateDestroyView, ApprovedBookingView, RejectBookingView

urlpatterns = [
    path("", BookingListCreateView.as_view(), name='booking-list-create'),  # list create
    path("<int:pk>/", BookingRetrieveUpdateDestroyView.as_view(), name='booking-detail'), # detail
    path("<int:booking_id>/venue-approve/", ApprovedBookingView.as_view(), name='approve_booking'), # approve
    path("<int:booking_id>/venue-reject/", RejectBookingView.as_view(), name='reject_booking'), # reject
]