
// service create data
service = {
    
    "service_name" : "Luxury Wedding Hall",
    "service_type" : "Venue",
    "location" : "123 Event Road, Cityville",
    "availability_start_date" : "2025-06-01",
    "availability_end_date" : "2025-12-31",
    "availability_type" : "recurring",
    "description": "A beautiful venue for weddings and corporate events.",
    "amenities": "WiFi, Parking, Catering",
    "service_quantity": 5,
    "service_mode": "on-site",

    "recurring_availability": [
        {
            "day_of_the_week": "Monday",
            "start_time": "09:00:00",
            "end_time": "17:00:00"
        },
        {
            "day_of_the_week": "Friday",
            "start_time": "14:00:00",
            "end_time": "22:00:00"
        }
    ],

    "pricing": [
        {
            "model_type": "Hourly",
            "base_price": 500,
            
            "price_packages": [
                {
                    "description": "Full-day package",
                    "name": "Gold",
                    "price": 3000,
                    "quantity_description": "Per day"
                }
            ]
        }
    ]
}
