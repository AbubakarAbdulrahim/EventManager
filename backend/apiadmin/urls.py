from django.urls import path
from . import views

urlpatterns = [
    # bookings admin urls
    path('bookings/', views.BookingsAdminListView.as_view(), name='admin-bookings-list'),
    path('booking/<int:pk>/', views.BookingsAdminDetailView.as_view(), name='admin-booking-detail'),
    
    # vendors admin urls
    path('vendors/', views.VendorAdminListView.as_view(), name='admin-vendor-list'),
    path('vendor/<int:pk>/', views.VendorAdminDetailView.as_view(), name='admin-vendor-detail'),
    path('vendor/<int:pk>/suspend-activate/', views.VendorAdminSuspendActivateView.as_view(), name='admin-vendor-suspend-activate'),  

    # vendor services admin urls
    path('services/', views.ServiceAdminListView.as_view(), name='admin-service-list'),
    path('service/<int:pk>/', views.ServiceAdminDetailView.as_view(), name='admin-service-detail'),
    path('service/<int:pk>/suspend-activate/', views.ServiceAdminSuspendActivateView.as_view(), name='admin-service-suspend-activate'),  

    # transactions admin urls
    path('transactions/', views.TransactionsAdminListView.as_view(), name='admin-transactions-list'),
    path('transaction/<int:pk>/', views.TransactionsAdminDetailView.as_view(), name='admin-transactions-detail'),

    # users admin urls
    path('users/', views.UsersAdminListView.as_view(), name='admin-users-list-create'),
    path('user/<int:pk>/', views.UsersAdminDetailView.as_view(), name='admin-users-list'),
    path('user/<int:pk>/suspend-activate/', views.UsersAdminSuspendActivateView.as_view(), name='admin-user-suspend-activate'),  
]