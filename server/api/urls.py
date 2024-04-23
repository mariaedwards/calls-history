from django.urls import path
from .views import get_call_history

urlpatterns = [
    path('calls/<str:phone_number>', get_call_history, name='call-history'),
]
