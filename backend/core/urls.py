from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),  # admin route
    path('user/token/', TokenObtainPairView.as_view(), name='get-token'),  # get token route
    path('user/reresh', TokenRefreshView.as_view(), name='refresh-token'),  # refresh token route
    path('users-auth/', include('rest_framework.urls')), # rest framework routes -> optional
    path('user/', include('users.urls')), # user app routes
    path('bookings/', include('bookings.urls')), #  bookings app routes
]
