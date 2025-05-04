from rest_framework.permissions import BasePermission

# custom vendor permission
class IsVendorRole(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'vendor' and request.user.is_approved