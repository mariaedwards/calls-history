from rest_framework import serializers
from .models import CallHistory, PhoneNumber

class CallHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CallHistory
        fields = ['created_at', 'counterparty', 'call_type', 'status', 'duration']

class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ['number', 'is_active']