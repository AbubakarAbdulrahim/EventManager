from django.core.mail import EmailMultiAlternatives
from background_task import background
from django.template.loader import render_to_string
from decouple import config


@background(schedule=1)
def send_email_task(subject, to_email, context, template_prefix):
    from_email = config('EMAIL_HOST_USER')
    html_content = render_to_string(f'{template_prefix}.html', context)
    text_content = 'Please view this Email in an HTML-compatible email client'

    message = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    message.attach_alternative(html_content, "text/html")
    message.send()