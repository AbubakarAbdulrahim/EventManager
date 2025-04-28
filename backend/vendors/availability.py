from .models import VendorPackageAvailability
from bookings.models import Booking


def is_vendor_package_available(vendor_package, event_date, start_time, end_time):
    
    # checks if vendor package availability match with this criteria
    available = VendorPackageAvailability.objects.filter(
        vendor_package=vendor_package,
        date=event_date,
        start_time__lte=start_time,
        end_time__gte=end_time,
    ).exists()
    if not available:
        return False
    
    '''
    checks through bookings of 
    the same vendor package
    in the same day 
    that starts before the new booking end time -> (thats a conflict)
    '''
    conflict = Booking.objects.filter(
    vendor_package=vendor_package,
    event_date=event_date,
    event_time__lt=end_time,
    ).exists()

    return not conflict
