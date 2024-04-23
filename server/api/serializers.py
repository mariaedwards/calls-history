from rest_framework import serializers
from .models import CallHistory, PhoneNumber

class CallHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CallHistory
        fields = ['created_at', 'counterparty', 'call_type', 'status', 'duration']

class PhoneNumberSerializer(serializers.ModelSerializer):
    missed_calls = serializers.IntegerField()
    completed_calls = serializers.IntegerField()
    average_duration = serializers.FloatField()

    class Meta:
        model = PhoneNumber
        fields = ['number', 'created_at', 'discontinued_at', 'is_active', 'missed_calls', 'completed_calls', 'average_duration']