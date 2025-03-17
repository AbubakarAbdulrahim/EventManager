from django.urls import path
from .views import VendorListCreate, VendorDetail

urlpatterns = [
    path('vendors/', VendorListCreate.as_view(), name='vendors-list'),
    path('vendors/<int:pk>/', VendorDetail.as_view(), name='vendors-detail'),
]
