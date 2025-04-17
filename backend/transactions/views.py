from rest_framework import generics
from .models import Transaction
from .serializer import TransactionSerializer
from rest_framework.permissions import IsAuthenticated


# list create view
class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    # on querying
    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(user=user)

    # on creating
    def perform_create(self, serializer):
        serializer.save()
        print(serializer.errors)

# detail view
class TransactionRetrieveView(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    