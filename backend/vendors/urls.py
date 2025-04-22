from django.urls import path
from . import views

urlpatterns = [
    # vendor endpoints
    path('', views.VendorListCreateView.as_view(), name='vendor-list-create'),
    path('<int:pk>/', views.VendorRetrieveUpdateDestroyView.as_view(), name='vendor-detail'),

    # vendor package endpoints
    path('vendor-packages/', views.VendorPackageListCreateView.as_view(), name='vendor-package-list-create'),
    path('vendor-packages/<int:pk>/', views.VendorPackageRetrieveUpdateDestroyView.as_view(), name='vendor-package-detail'),
]