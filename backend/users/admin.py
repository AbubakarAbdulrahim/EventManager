from django.contrib import admin
from .models import User
from bookings.models import Booking
from venues.models import Venue
from transactions.models import Transaction

class UserAdmin(admin.AdminSite):
    site_header = 'event planner admin site'
    


user_admin = UserAdmin(name='admin_panel')

user_admin.register([User, Booking, Venue, Transaction])
