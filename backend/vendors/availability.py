from .models import (
    ServiceRecurringAvailability, 
    ServiceSpecificDateAvailability,
)
from bookings.models import Booking


def is_service_available(service, event_date, start_time, end_time):
    day = event_date

    # checks if service availability match with this criteria
    recurring_avail = ServiceRecurringAvailability.objects.filter(
        service=service,
        day_of_the_week=day,
        start_time__lte=start_time,
        end_time__gte=end_time,
    ).exists()
    if not recurring_avail:
        return False
    
    date_avail = ServiceSpecificDateAvailability.objects.filter(
        service=service,
        date=event_date,
        start_time__lte=start_time,
        end_time__gte=end_time,
    ).exists()
    if not date_avail:
        return False
    
    '''
    checks through bookings of 
    the same vendor package
    in the same day 
    that starts before the new booking end time -> (thats a conflict)
    '''
    conflict = Booking.objects.filter(
    service=service,
    event_date=event_date,
    event_time__lt=end_time,
    ).exists()

    return not conflict
