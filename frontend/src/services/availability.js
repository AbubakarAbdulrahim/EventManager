export const availability = [
    {
      serviceId: '1',
      availableDates: [
        {
          date: '2025-04-15',
          timeSlots: [
            { time: '19:00', isBooked: true },
            { time: '17:00', isBooked: true },
            { time: '11:00', isBooked: true },
            { time: '18:00', isBooked: false }
          ]
        },
        {
          date: '2025-04-16',
          timeSlots: [
            { time: '19:00', isBooked: false },
            { time: '17:00', isBooked: true },
            { time: '11:00', isBooked: false },
            { time: '18:00', isBooked: false }
          ]
        }
      ]
    },
    {
      serviceId: '2',
      availableDates: [
        {
          date: '2025-04-15',
          timeSlots: [
            { time: '19:00', isBooked: false },
            { time: '17:00', isBooked: false },
            { time: '11:00', isBooked: true },
            { time: '18:00', isBooked: false }
          ]
        },
        {
          date: '2025-04-16',
          timeSlots: [
            { time: '19:00', isBooked: true },
            { time: '17:00', isBooked: true },
            { time: '11:00', isBooked: false },
            { time: '18:00', isBooked: true }
          ]
        }
      ]
    },
    // Adding more services
    ...Array.from({ length: 25 }, (_, idx) => ({
      serviceId: (idx + 3).toString(),
      availableDates: [
        {
          date: `2025-04-${(15 + idx) % 30 + 1}`,
          timeSlots: [
            { time: '19:00', isBooked: false },
            { time: '17:00', isBooked: false },
            { time: '11:00', isBooked: false },
            { time: '18:00', isBooked: false }
          ]
        },
        {
          date: `2025-04-${(16 + idx) % 30 + 1}`,
          timeSlots: [
            { time: '19:00', isBooked: true },
            { time: '17:00', isBooked: true },
            { time: '11:00', isBooked: true },
            { time: '18:00', isBooked: false }
          ]
        }
      ]
    }))
  ];
  

export default availability;

export const getAvailability = (serviceId) => {
  return availability.find(service => service.serviceId === serviceId);
};

export const getAvailableDates = (serviceId) => {
  const service = getAvailability(serviceId);
  return service ? service.availableDates : [];
};

export const getAvailableDatesWithBookings = (serviceId) => {
    const service = getAvailability(serviceId);
    if (!service) return [];
    
    // Filter out booked dates
    const availableDates = service.availableDates.filter(date => {
        return date.timeSlots.some(slot => !slot.isBooked);
    });
    
    // Return only available dates
    return availableDates.map(date => date.date);
    }

export const getAvailableTimeSlots = (serviceId, date) => {
  const service = getAvailability(serviceId);
    // Check if service exists
  if (!service) return [];

  const availableDate = service.availableDates.find(d => d.date === date);
  if (!availableDate) return [];
    // Filter out booked time slots
    // var availableDateTimeSlots = availableDate.timeSlots.filter(slot => !slot.isBooked);
    // Return only available time slots
    // availableDateTimeSlots = availableDateTimeSlots.map(slot => slot.time);
return availableDate.timeSlots.filter(slot => !slot.isBooked).map(slot => slot.time);

};

export const setAvailableTimeSlots = (serviceId, date, time) => {
  const service = getAvailability(serviceId);
  if (service) {
    const availableDate = service.availableDates.find(d => d.date === date);
    if (availableDate) {
      const existingTimeSlot = availableDate.timeSlots.find(slot => slot.time === time);
      if (!existingTimeSlot) {
        availableDate.timeSlots.push({ time, isBooked: false });
      }
    }
  }
}

export const setAvailableDates = (serviceId, date) => {
  const service = getAvailability(serviceId);
  if (service) {
    const existingDate = service.availableDates.find(d => d.date === date);
    if (!existingDate) {
      service.availableDates.push({ date, timeSlots: [] });
    }
  }
}

export const setAvailableDatesWithBookings = (serviceId, date, time) => {
  const service = getAvailability(serviceId);
  if (service) {
    const availableDate = service.availableDates.find(d => d.date === date);
    if (availableDate) {
      const existingTimeSlot = availableDate.timeSlots.find(slot => slot.time === time);
      if (!existingTimeSlot) {
        availableDate.timeSlots.push({ time, isBooked: true });
      }
    } else {
      service.availableDates.push({ date, timeSlots: [{ time, isBooked: true }] });
    }
  }
}

export const setIsBooked = (serviceId, date, time) => {
  availability.forEach(service => {
    // Check if the service ID matches
    if (service.serviceId === serviceId) {
      const availableDate = service.availableDates.find(d => d.date === date);
      // service.availableDates.find(d => {console.log('Available date:', d.date, 'Time slots:', d.timeSlots); return d.date === date;});

      // Check if the date exists in the available dates
      if (availableDate) {
        const existingTimeSlot = availableDate.timeSlots.find(slot => slot.time === time);
        if (existingTimeSlot) {
          // console.log('Booking time slot:', time, 'on date:', date, 'for service:', serviceId);
          // Update the isBooked status of the existing time slot
          service.availableDates.find(d => d.date === date).isBooked = true;
        }
      }
    }
  } 
);
}
// Example usage
// console.log(getAvailableDates('1').map(date => date.date));
// // console.log(getAvailableTimeSlots('1', '2025-04-15'));
// var g= getAvailableDates('1').map(date => date.date)[0]
// console.log(getAvailableTimeSlots('1', g));
// console.log(g)
// console.log(getAvailableTimeSlots('1', '2025-04-15'));
// console.log(getAvailableTimeSlots('1', getAvailableDates('1').map(date => date.date)[0]));

// var g=getAvailableDates('1')
// console.log(g)
// // console.log(getAvailableTimeSlots('1', g[3]));
// g.map(date => console.log(getAvailableTimeSlots('1', date)));

// // console.log(getAvailableTimeSlots('1', '2025-04-15'));
// console.log(getAvailableDatesWithBookings(''));
// console.log(getAvailableTimeSlots('2', getAvailableDatesWithBookings('2')[1]));
// console.log(getAvailableDatesWithBookings('3').map(date => getAvailableTimeSlots('3', date)));


