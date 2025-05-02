from django.urls import path
from . import views

urlpatterns = [
    # bookings admin urls
    path('bookings/', views.BookingsAdminListCreateView.as_view(), name='admin-bookings-list-create'),
    path('booking/<int:pk>/', views.BookingsAdminDetailView.as_view(), name='admin-bookings-detail'),
    
    # vendors admin urls
    path('vendors/', views.VendorAdminListCreateView.as_view(), name='admin-vendors-list-create'),
    path('vendor/<int:pk>/', views.VendorAdminDetailView.as_view(), name='admin-vendors-detail'),
    path('vendor/<int:pk>/suspend-activate/', views.VendorAdminSuspendActivateView.as_view(), name='admin-vendor-suspend-activate'),  

    # vendor packages admin urls
    path('services/', views.ServiceAdminListCreateView.as_view(), name='admin-service-list-create'),
    path('service/<int:pk>/', views.ServiceAdminDetailView.as_view(), name='admin-service-detail'),
    path('service/<int:pk>/suspend-activate/', views.ServiceAdminSuspendActivateView.as_view(), name='admin-service-suspend-activate'),  

    # transactions admin urls
    path('transactions/', views.TransactionsAdminListCreateView.as_view(), name='admin-transactions-list-create'),
    path('transaction/<int:pk>/', views.TransactionsAdminDetailView.as_view(), name='admin-transactions-detail'),

    # users admin urls
    path('users/', views.UsersAdminListCreateView.as_view(), name='admin-users-list-create'),
    path('user/<int:pk>/', views.UsersAdminDetailView.as_view(), name='admin-users-list-create'),
    path('user/<int:pk>/suspend-activate/', views.UsersAdminSuspendActivateView.as_view(), name='admin-user-suspend-activate'),  
]