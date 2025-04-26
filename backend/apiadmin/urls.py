from django.urls import path
from . import views

urlpatterns = [
    # bookings admin urls
    path('bookings/', views.BookingsAdminListCreateView.as_view(), name='admin-bookings-list-create'),
    path('bookings/<int:pk>/', views.BookingsAdminDetailView.as_view(), name='admin-bookings-detail'),
    
    # vendors admin urls
    path('vendors/', views.VendorsAdminListCreateView.as_view(), name='admin-vendors-list-create'),
    path('vendors/<int:pk>/', views.VendorsAdminDetailView.as_view(), name='admin-vendors-detail'),
    path('vendors/<int:pk>/suspend-activate/', views.VendorsAdminSuspendActivateView.as_view(), name='admin-vendor-suspend-activate'),  

    # vendor packages admin urls
    path('vendor-packages/', views.VendorPackagesAdminListCreateView.as_view(), name='admin-vendor-package-list-create'),
    path('vendor-packages/<int:pk>/', views.VendorPackagesAdminDetailView.as_view(), name='admin-vendor-package-detail'),
    path('vendor-packages/<int:pk>/suspend-activate/', views.VendorPackagesAdminSuspendActivateView.as_view(), name='admin-vendor-package-suspend-activate'),  

    # transactions admin urls
    path('transactions/', views.TransactionsAdminListCreateView.as_view(), name='admin-transactions-list-create'),
    path('transactions/<int:pk>/', views.TransactionsAdminDetailView.as_view(), name='admin-transactions-detail'),

    # users admin urls
    path('users/', views.UsersAdminListCreateView.as_view(), name='admin-users-list-create'),
    path('users/<int:pk>/', views.UsersAdminDetailView.as_view(), name='admin-users-list-create'),
    path('users/<int:pk>/suspend-activate/', views.UsersAdminSuspendActivateView.as_view(), name='admin-user-suspend-activate'),  
]