from django.urls import path
from . import views

urlpatterns = [
    # bookings admin urls
    path('bookings/', views.BookingsAdminListView.as_view(), name='admin-bookings-list'),
    path('booking/<int:pk>/', views.BookingsAdminDetailView.as_view(), name='admin-booking-detail'),
    
    # vendors admin urls
<<<<<<< Updated upstream
    path('vendors/', views.VendorAdminListView.as_view(), name='admin-vendor-list'),
    path('vendor/<int:pk>/', views.VendorAdminDetailView.as_view(), name='admin-vendor-detail'),
    path('vendor/<int:pk>/suspend-activate/', views.VendorAdminSuspendActivateView.as_view(), name='admin-vendor-suspend-activate'),  

    # vendor services admin urls
    path('services/', views.ServiceAdminListView.as_view(), name='admin-service-list'),
    path('service/<int:pk>/', views.ServiceAdminDetailView.as_view(), name='admin-service-detail'),
    path('service/<int:pk>/suspend-activate/', views.ServiceAdminSuspendActivateView.as_view(), name='admin-service-suspend-activate'),  

=======
    path('vendors/', views.VendorsAdminListCreateView.as_view(), name='admin-vendors-list-create'),
    path('vendors/<int:pk>/', views.VendorsAdminDetailView.as_view(), name='admin-vendors-detail'),
    path('vendors/<int:pk>/handle-status/', views.VendorsSuspendApproveRejectView.as_view(), name='admin-vendor-suspend-approve-reject'),

    # vendor packages admin urls
    path('vendor-packages/', views.VendorPackagesAdminListCreateView.as_view(), name='admin-vendor-package-list-create'),
    path('vendor-packages/<int:pk>/', views.VendorPackagesAdminDetailView.as_view(), name='admin-vendor-package-detail'),
    path('vendor-packages/<int:pk>/handle-status/', views.VendorPackagesSuspendApproveRejectView.as_view(), name='admin-vendor-package-suspend-approve-reject'),
    
>>>>>>> Stashed changes
    # transactions admin urls
    path('transactions/', views.TransactionsAdminListView.as_view(), name='admin-transactions-list'),
    path('transaction/<int:pk>/', views.TransactionsAdminDetailView.as_view(), name='admin-transactions-detail'),

    # users admin urls
    path('users/', views.UsersAdminListView.as_view(), name='admin-users-list-create'),
    path('user/<int:pk>/', views.UsersAdminDetailView.as_view(), name='admin-users-list'),
    path('user/<int:pk>/suspend-activate/', views.UsersAdminSuspendActivateView.as_view(), name='admin-user-suspend-activate'),  
]