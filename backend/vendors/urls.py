from django.urls import path
from . import views

urlpatterns = [
    # vendor endpoints
    path('', views.VendorListCreateView.as_view(), name='vendor-list-create'),
    path('<int:pk>/', views.VendorRetrieveUpdateDestroyView.as_view(), name='vendor-detail'),

    # vendor package endpoints
    path('vendor-packages/', views.VendorPackageListView.as_view(), name='vendor-package-list'),
    path('vendor-packages/create/', views.VendorPackageCreateView.as_view(), name='vendor-package-create'),
    path('vendor-packages/<int:pk>/', views.VendorPackageRetrieveView.as_view(), name='vendor-package-detail'),
    path('vendor-packages/<int:pk>/update/', views.VendorPackageUpdateView.as_view(), name='vendor-package-update'),
    path('vendor-packages/<int:pk>/delete/', views.VendorPackageDestroyView.as_view(), name='vendor-package-delete'),
]