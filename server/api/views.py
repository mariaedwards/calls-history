from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PhoneNumber, CallHistory
from .serializers import CallHistorySerializer,PhoneNumberSerializer

class CallHistoryList(APIView):
    def get(self, request, phone_number):
        phone = get_object_or_404(PhoneNumber, number=phone_number)
        call_histories = CallHistory.objects.filter(phone_number=phone)
        serializer = CallHistorySerializer(call_histories, many=True)
        return Response(serializer.data)

class PhoneNumberList(APIView):
    def get(self, request):
        phone_numbers = PhoneNumber.objects.all()
        serializer = PhoneNumberSerializer(phone_numbers, many=True)
        return Response(serializer.data)