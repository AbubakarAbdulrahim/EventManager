from rest_framework import generics
from .models import User
from .serializer import UserSerializer
from rest_framework.permissions import AllowAny


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

