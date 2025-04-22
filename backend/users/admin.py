from django.contrib import admin
from .models import User
from bookings.models import Booking
from transactions.models import Transaction
from vendors.models import Vendor, VendorPackageImages, VendorPackage

class UserAdmin(admin.AdminSite):
    site_header = 'event planner admin site'
    


user_admin = UserAdmin(name='admin_panel')

user_admin.register([User, Booking, Vendor, VendorPackage, VendorPackageImages, Transaction])
