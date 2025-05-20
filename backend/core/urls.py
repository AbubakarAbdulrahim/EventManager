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
    
    
    
    # for users email previews
    path('welcome-email/', views.WelcomeEmailView.as_view()),
    path('password-reset-email/', views.PasswordResetEmailView.as_view()),
    
    # for vendors
    path('vendor-profile-update-email/', views.VendorProfileUpdateEmailView.as_view()),
    path('vendor-request-status-email/', views.VendorRequestStatusEmailView.as_view()),
    path('vendor-application-email/', views.VendorApplicationEmailView.as_view()),

    # for bookings
    path('new-booking-email/', views.NewBookingEmailView.as_view()),
    path('booking-confirmed-email/', views.BookingConfirmedEmailView.as_view()),
    path('booking-cancelled-email/', views.BookingCancelledEmailView.as_view()),

    # other email previews
    path('event-reminder-email/', views.EventReminderEmailView.as_view()),
    path('leave-a-review-email/', views.LeaveReviewEmailView.as_view()),
    path('new-message-email/', views.NewMessageEmailView.as_view()),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)