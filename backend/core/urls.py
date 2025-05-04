from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from users.admin import user_admin


urlpatterns = [
    path('admin/', user_admin.urls),  # admin route
    path('api-admin/', include('apiadmin.urls')),  # api admin routes
    path('user/', include('users.urls')), # user app routes
    path('bookings/', include('bookings.urls')), #  bookings app routes
    path('transactions/', include('transactions.urls')),  # trxns app route
    path('vendors/', include('vendors.urls')), # vendors app route
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)