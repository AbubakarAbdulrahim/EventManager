# from django.contrib import admin
from django.urls import path, include
from users.admin import user_admin

urlpatterns = [
    path('admin/', user_admin.urls),  # admin route
    path('user/', include('users.urls')), # user app routes
    path('bookings/', include('bookings.urls')), #  bookings app routes
    path('transactions/', include('transactions.urls')),  # trxns app route
    path('vendors/', include('vendors.urls')), # vendos app route
]
