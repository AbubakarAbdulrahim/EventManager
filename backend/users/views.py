from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializer import (
    UserProfileSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    PasswordUpdateSerializer,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from tasks.tasks import send_email_task
from datetime import datetime
from decouple import config

User = get_user_model() 

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
                path="/user/token/refresh/"
            )
        return response

# overrided access refresh view
class RefreshAccessView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)
        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get('user_id')
            if not User.objects.filter(id=user_id).exists():
                return Response({"error": "user not found"}, status=401)
            
            access = str(refresh.access_token)
            return Response({"access": access})
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)

# logout view
class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()  # blacklists the token
            except TokenError as e:
                # token already expired or invalid
                pass

        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh", path="/user/token/refresh/")
        return response
   
# user retrieve view
class UserRetrieveView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user= self.request.user
        return User.objects.filter(id=user.id)
    
# user update view
class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user= self.request.user
        return User.objects.filter(id=user.id)

    # on update
    def perform_update(self, serializer):
        pass
    
# user delete view
class UserDestroyView(generics.DestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        user= self.request.user
        return User.objects.filter(id=user.id)

# user create view
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    # on create
    def perform_create(self, serializer):
        user = serializer.save()
        template_prefix = 'user_emails/welcome'
        context = {
            'username' : user.username,
            'current_year' : datetime.now().year,
            'dashboard_url' : '/',
            'email' : config('EMAIL_HOST_USER'),
            'subject' : 'Welcome to Event Master!'
        }

        # send welcome email to a user
        send_email_task(
            subject='Welcome to Event Master!', 
            to_email=user.email, 
            context=context, 
            template_prefix=template_prefix
            )

# user password update view
class PasswordUpdateView(generics.UpdateAPIView):
    serializer_class = PasswordUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(id=user.id)
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        user = request.user
        template_prefix = 'user_emails/password_reset'
        context = {
            'current_year' : datetime.now().year,
            'subject' : 'Reset Your Password',
            'username' : user.username,
            'password_reset_link' : '/',
            'duration' : '1 hour'
        }
        
        # send password reset email
        send_email_task(
            subject='Password Reset Comfirmation!', 
            to_email=user.email, 
            context=context, 
            template_prefix=template_prefix
            )
        
        return response