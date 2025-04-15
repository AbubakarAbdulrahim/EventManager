from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializer import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

User = get_user_model() # getting current user model

# update view
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # on update
    def perform_update(self, serializer):
        return super().perform_update(serializer)


# retrieve delete view
class UserRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# create view
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    # on create
    def perform_create(self, serializer):
        serializer.save()
    

