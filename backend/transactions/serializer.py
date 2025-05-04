from rest_framework import serializers
from .models import Transaction

# trxn serializer
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "booking", 
            "user", 
            "amount", 
            "transaction_type", 
            "transaction_status", 
            "transaction_date",
            "referrence_id",
            "payment_gateway",
        ]
        read_only_fields = [
            "booking",
            "user",
            "commission_calculated",
            "transaction_status",
        ]

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
        fields = [
            "id",
            "booking", 
            "user", 
            "amount", 
            "transaction_type", 
            "transaction_status", 
            "transaction_date",
            "referrence_id",
            "payment_gateway",
        ]
        read_only_fields = [
            "id",
            "booking", 
            "user", 
            "amount", 
            "transaction_type", 
            "transaction_status", 
            "transaction_date",
            "referrence_id",
            "payment_gateway",
        ]