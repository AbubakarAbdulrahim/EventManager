from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authentiated and request.user.role == 'admin'


