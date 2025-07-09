from django.urls import path
from . import views
from vendors.views import ServiceReviewCreateView

urlpatterns = [
    path('register/', views.UserCreateView.as_view(), name='register_user'),
    path('<int:pk>/', views.UserRetrieveView.as_view(), name='retrieve_user'),
    path('<int:pk>/update/', views.UserUpdateView.as_view(), name='update_user'),
    path('<int:pk>/delete/', views.UserDestroyView.as_view(), name='delete_user'),
    path("token/", views.CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", views.RefreshAccessView.as_view(), name="token_refresh"),
    path("logout/", views.LogoutView.as_view(), name="logout"),



    #
    #
    #


    path("track-event/<int:service_id>/", views.UserEventCreateView.as_view(), name='track-user-event'),



    #
    #
    #



    path("notification/", views.NotificationListCreateView.as_view(), name='notificattion-list-create'),
    path("notification/<int:pk>/", views.NotificationDetailView.as_view(), name='notificattion-retrieve-destroy'),
    
    
    
    #
    #
    #



    path("create-review/<int:service_id>/", ServiceReviewCreateView.as_view(), name='create-review')
    
]