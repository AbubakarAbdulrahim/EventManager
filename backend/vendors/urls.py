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
    path('services/', views.ServiceListView.as_view(), name='vendor-package-list'),
    path('services/create/', views.ServiceCreateView.as_view(), name='vendor-package-create'),
    path('services/<int:pk>/', views.ServiceRetrieveView.as_view(), name='vendor-package-detail'),
    path('services/<int:pk>/update/', views.ServiceUpdateView.as_view(), name='vendor-package-update'),
    path('services/<int:pk>/delete/', views.ServiceDestroyView.as_view(), name='vendor-package-delete'),
    

    #
    #
    #


    # vendor package availability endpoints
    path('service/<int:pk>/availability/', views.ServiceAvailabilityRetrievView.as_view(), name='service-availability-list'),
]