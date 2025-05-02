from django.urls import path
<<<<<<< Updated upstream
from . import views

urlpatterns = [
    path("", views.BookingCreateView.as_view(), name='booking-create'),
    path("<int:pk>/", views.BookingRetrieveView.as_view(), name='booking-retrive'),
    path("<int:pk>/update/", views.BookingUpdateView.as_view(), name='booking-update'), 
    path("<int:pk>/delete/", views.BookingDestroyView.as_view(), name='booking-delete'),
    path("list/<int:pk>/", views.BookingListView.as_view(), name='booking-list'), # for a particular user
=======
# from .views import BookingListCreateView, BookingRetrieveUpdateDestroyView, ApprovedBookingView, RejectBookingView

urlpatterns = [
    # path("", BookingListCreateView.as_view(), name='booking-list-create'),  # list create
    # path("<int:pk>/", BookingRetrieveUpdateDestroyView.as_view(), name='booking-detail'), # detail

    
    # path("<int:booking_id>/venue-approve/", ApprovedBookingView.as_view(), name='approve_booking'), # approve
    # path("<int:booking_id>/venue-reject/", RejectBookingView.as_view(), name='reject_booking'), # reject
>>>>>>> Stashed changes
]