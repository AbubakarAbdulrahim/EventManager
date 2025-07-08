from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.BookingCreateView.as_view(), name='booking-create'),
    path("user-bookings/", views.UserBookingListView.as_view(), name='user-bookings-list'),
    path("booked-slot/<str:date>/", views.BookedSlotsView.as_view(), name='booked-slots-list'),
    path("check-availability/", views.CheckAvailabilityView.as_view(), name='check-availability-list'),
    path("vendor-bookings/", views.VendorBookingListView.as_view(), name='vendor-bookings-list'),
    path("<int:pk>/", views.BookingRetrieveView.as_view(), name='booking-detail'),
    path("<int:pk>/update/", views.BookingUpdateView.as_view(), name='booking-update'), 
    path("<int:pk>/delete/", views.BookingDestroyView.as_view(), name='booking-delete'),
]