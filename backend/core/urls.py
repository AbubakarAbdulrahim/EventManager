# from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.admin import user_admin

urlpatterns = [
    path('admin/', user_admin.urls),  # admin route
    path('user/token/', TokenObtainPairView.as_view(), name='get-token'),  # get token route
    path('user/refresh', TokenRefreshView.as_view(), name='refresh-token'),  # refresh token route
    path('user/', include('users.urls')), # user app routes
    path('bookings/', include('bookings.urls')), #  bookings app routes
    path('transactions/', include('transactions.urls')),  # trxns app route
    path('vendors/', include('vendors.urls')), # vendos app route
]
