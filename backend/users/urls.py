from django.urls import path
from .views import (
    UserCreateView, # user register view
    UserRetrieveView, # user detail view
    UserUpdateView, # user update view
    UserDestroyView, # user delete view
    CookieTokenObtainPairView, # user token obtain pair view
    RefreshAccessView, # user refresh access view
    LogoutView  # user  logout
    )

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register_user'),  # user register
    path('<int:pk>/', UserRetrieveView.as_view(), name='retrieve_user'), # user retrieve/delete
    path('<int:pk>/update/', UserUpdateView.as_view(), name='update_user'), # user update
    path('<int:pk>/delete/', UserDestroyView.as_view(), name='delete_user'), # delete user
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"), # user get token pair
    path("token/refresh/", RefreshAccessView.as_view(), name="token_refresh"), # user refresh access
    path("logout/", LogoutView.as_view(), name="logout"),  # user logout
]