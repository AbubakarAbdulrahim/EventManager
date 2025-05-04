from django.urls import path
from .views import (
    UserCreateView, 
    UserRetrieveView, 
    UserUpdateView, 
    UserDestroyView, 
    CookieTokenObtainPairView, 
    RefreshAccessView, 
    LogoutView
    )

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register_user'),
    path('<int:pk>/', UserRetrieveView.as_view(), name='retrieve_user'),
    path('<int:pk>/update/', UserUpdateView.as_view(), name='update_user'),
    path('<int:pk>/delete/', UserDestroyView.as_view(), name='delete_user'),
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", RefreshAccessView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
]