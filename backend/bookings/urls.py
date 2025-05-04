from django.urls import path
from . import views

urlpatterns = [
    path("", views.BookingCreateView.as_view(), name='booking-create'),
    path("<int:pk>/", views.BookingRetrieveView.as_view(), name='booking-retrive'),
    path("<int:pk>/update/", views.BookingUpdateView.as_view(), name='booking-update'), 
    path("<int:pk>/delete/", views.BookingDestroyView.as_view(), name='booking-delete'),
    path("list/<int:pk>/", views.BookingListView.as_view(), name='booking-list'), # for a particular user
]