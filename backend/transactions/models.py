from django.db import models
from bookings.models import Booking
from django.contrib.auth import get_user_model

User = get_user_model()

# trxn table
class Transaction(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="transaction")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    transaction_type = models.CharField(max_length=10)
    transaction_status = models.CharField(max_length=10)
    transaction_date = models.DateTimeField(auto_now_add=True)
    referrence_id = models.CharField(max_length=50, unique=True)
    payment_gateway = models.CharField(max_length=50)
    commission_calculated = models.DecimalField(max_digits=20, decimal_places=2)

    # on display
    def __str__(self):
        return f'Transaction {self.id} - {self.transaction_status}'


# Invoices Table (optional)
# id	Primary Key
# user_id	Foreign Key → Users
# transaction_id	Foreign Key → Transactions
# amount	Decimal
# description	Text
# issued_at	DateTime