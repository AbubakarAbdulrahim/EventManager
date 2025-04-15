from django.urls import path
from .views import TransactionListCreateView, TransactionRetrieveView


urlpatterns = [
    path('', TransactionListCreateView.as_view(), name='trxn_list_create'),
    path('<int:pk>/', TransactionRetrieveView.as_view(), name='trxn_detail'), # trxn_detail
]