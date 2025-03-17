from django.contrib import admin
from .models import Vendors

#Vendor Admin

@admin.register(Vendors)
class VendorsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'is_available')  
    search_fields = ('name', 'phone') 
    list_filter = ('is_available',) 
    ordering = ('name',)
