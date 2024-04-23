from django.urls import path
from .views import CallHistoryList, PhoneNumberList

urlpatterns = [
    path('calls/<str:phone_number>/', CallHistoryList.as_view(), name='call-history-list'),
    path('phone-numbers/', PhoneNumberList.as_view(), name='phone-number-list'),
]