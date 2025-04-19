from django.urls import path
from .views import (
    UserCreateView, # user register view
    UserRetrieveDestroyView, # user detail view
    UserUpdateView, # user update view
    CookieTokenObtainPairView, # user token obtain pair view
    RefreshAccessView, # user refresh access view
    LogoutView  # user  logout
    )

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),  # user register
    path('<int:pk>/delete/', UserRetrieveDestroyView.as_view(), name='retrieve_delete'), # user retrieve/delete
    path('<int:pk>/update', UserUpdateView.as_view(), name='update'), # user update
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"), # user get token pair
    path("token/refresh/", RefreshAccessView.as_view(), name="token_refresh"), # user refresh access
    path("logout/", LogoutView.as_view(), name="logout"),  # user logout
]