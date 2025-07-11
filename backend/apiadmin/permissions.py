from rest_framework.permissions import BasePermission

# custom admin permission
class IsAdminRole(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


