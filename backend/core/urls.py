from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from users.admin import user_admin
from vendors import views


urlpatterns = [
    path('admin/', user_admin.urls),  # admin route
    path('api-admin/', include('apiadmin.urls')),  # api admin routes
    path('user/', include('users.urls')), # user app routes
    path('bookings/', include('bookings.urls')), #  bookings app routes
    path('transactions/', include('transactions.urls')),  # trxns app route
    path('vendors/', include('vendors.urls')), # vendors app route
    
    
    # for email previews
    path('welcome-email/', views.WelcomeEmailView.as_view(), name='welcome-email'),
    path('password-reset-email/', views.PasswordResetEmailView.as_view(), name='password-reset-email'),
    path('vendor-profile-update-email/', views.VendorProfileUpdateEmailView.as_view(), name='profile-update-email'),
    path('request-denial-email/', views.RequestDenialEmailView.as_view(), name='request-denial-email'),
    path('vendor-application-email/', views.VendorApplicationEmailView.as_view(), name='vendor-application-email'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)