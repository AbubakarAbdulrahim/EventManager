from background_task import background
from django.core.mail import send_mail

# async functions
# @background(schedule=5)
# def notify_venue(venue_email, message, subject, sender_email):
#     send_mail(
#         subject= subject,
#         message= message,
#         from_email= sender_email,
#         recipient_list= [venue_email],
#     )
# @background(schedule=5)
# def notify_user(user_email, message, subject, sender_email):
#     send_mail(
#         subject= subject,
#         message= message,
#         from_email= sender_email,
#         recipient_list= [user_email],
#     )
# @background(schedule=5)
# def notify_vendor(vendor_email, subject, message, sender_email):
#     send_mail(
#         subject= subject,
#         message= message,
#         from_email= sender_email,
#         recipient_list= [vendor_email],
#     )
# @background(schedule=5)
# def notify_admins(admin_emails:list, message, subject, sender_email):
#     send_mail(
#         subject= subject,
#         message= message,
#         from_email= sender_email,
#         recipient_list= admin_emails,
#     )

# user welcome email
# def send_user_welcome_email(user):
#     subject= f"Welcome to Event Master, Let's Plan Something Amazing!
#     message = f'',
#     from_email= ''
#     recipient_list= []

#     send_mail(

#     )