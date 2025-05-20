from django.urls import path
from . import views

urlpatterns = [
    
    # vendor endpoints
    path('', views.VendorListView.as_view(), name='vendors'),
    path('create/', views.VendorCreateView.as_view(), name='vendor-create'),
    path('<int:pk>/', views.VendorRetrieveView.as_view(), name='vendor-detail'),
    path('<int:pk>/update/', views.VendorUpdateView.as_view(), name='vendor-update'),
    path('<int:pk>/delete/', views.VendorDestroyView.as_view(), name='vendor-delete'),



    #
    #
    #



    # vendor package endpoints
    path('services/', views.ServiceListView.as_view(), name='service-list'),
    path('services/create/', views.ServiceCreateView.as_view(), name='service-create'),
    path('services/<int:pk>/', views.ServiceRetrieveView.as_view(), name='service-detail'),
    path('services/<int:pk>/update/', views.ServiceUpdateView.as_view(), name='service-update'),
    path('services/<int:pk>/delete/', views.ServiceDestroyView.as_view(), name='service-delete'),
    path('service-images/<int:service_id>/update/', views.ServiceImageUpdateView.as_view(), name='service-image-update'),
    path('service-images/<int:service_id>/delete/', views.ServiceImageDestroyView.as_view(), name='service-image-delete'),
    


    #
    #
    #



    # vendor service availability endpoints
    path('service/<int:service_id>/availability/', views.ServiceAvailabilityListView.as_view(), name='service-availability-list'),
    path('service/<int:service_id>/availability/update/', views.ServiceAvailabilityBulkUpdateView.as_view(), name='service-availability-update'),
]
