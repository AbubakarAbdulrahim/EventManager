from django.urls import path
from .views import UserCreateView, UserRetrieveDestroyView, UserUpdateView

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),  # register
    path('<int:pk>/delete/', UserRetrieveDestroyView.as_view(), name='retrieve_delete'), # retrieve delete
    path('<int:pk>/update', UserUpdateView.as_view(), name='update'), # update
]