from rest_framework import serializers
from .models import Transaction

# trxn serializer
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "booking", 
            "user", 
            "amount", 
            "transaction_type", 
            "transaction_status", 
            "transaction_date",
            "referrence_id",
            "payment_gateway",
            )
        extra_kwargs = {
            "booking" : {"read_only" : True},
            "user" : {"read_only" : True},
            "commission_calculated" : {"read_only": True}
        }
        read_only_fields = ["transaction_status"]

    def create(self, validated_data):
        user = self.context['request'].user
        transaction = Transaction.objects.create(
            booking = user.booking,
            user = user,
            amount = validated_data['amount'],
            transaction_type = validated_data['transaction_type'],
            transaction_status = validated_data['transaction_status'],
            transaction_date = validated_data['transaction_date'],
            referrence_id = validated_data['referrence_id'],
            payment_gateway = validated_data['payment_gateway'],
            commission_calculated = validated_data['amount'] * 0.1
        )
        transaction.save()
        return transaction
    

class TransactionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'