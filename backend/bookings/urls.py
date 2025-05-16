from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.BookingCreateView.as_view(), name='booking-create'),
    path("user-bookings", views.UserBookingListView.as_view(), name='user-bookings-list'),
    path("vendor-bookings/", views.VendorBookingListView.as_view(), name='vendor-bookings-list'),
    path("<int:pk>/", views.BookingRetrieveView.as_view(), name='booking-detail'),
    path("<int:pk>/update/", views.BookingUpdateView.as_view(), name='booking-update'), 
    path("<int:pk>/delete/", views.BookingDestroyView.as_view(), name='booking-delete'),
]