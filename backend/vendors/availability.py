from .models import VendorAvailability
from bookings.models import Booking


def is_vendor_available(vendor, event_date, start_time, end_time):
    week_day = event_date.strftime('%a').lower()[:3]  # 'Mon' -> 'mon'
    
    # checks if vendor availability match with this criteria
    available = VendorAvailability.objects.filter(
        vendor=vendor,
        day=week_day,
        start_time__lte=start_time,
        end_time__gte=end_time,
    ).exists()
    if not available:
        return False
    
    '''
    checks through bookings of 
    the same vendor
    in the same day 
    that starts before the new booking end time -> (thats a conflict)
    '''
    conflict = Booking.objects.filter(
    vendor_package__vendor=vendor,
    event_date=event_date,
    event_time__lt=end_time,
    ).exists()

    return not conflict
