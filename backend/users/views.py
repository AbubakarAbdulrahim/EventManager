from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializer import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

User = get_user_model() # getting current user model

# overrided token obtain view
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            refresh = response.data.get("refresh")  # get the token 
            del response.data["refresh"]  # delete the refresh token
            response.set_cookie(
                key="refresh", 
                value=refresh, 
                httponly=True, 
                secure=False, 
                samesite= "Lax", 
                max_age=86400,
                path="/user/token/refresh"
            )
        return response

# overrided access refresh view
class RefreshAccessView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)
        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            return Response({"access": access})
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)

# logout view
class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        return response

# user update view
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
    

