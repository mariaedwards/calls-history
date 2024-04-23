import datetime

from django.db.models import Avg, Case, Count, IntegerField, Min, When
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import CallHistory, PhoneNumber
from .serializers import CallHistorySerializer, PhoneNumberSerializer


def parse_date(date_str, default=None):
    try:
        return datetime.datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return default

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class PhoneNumberList(generics.ListAPIView):
    serializer_class = PhoneNumberSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date', timezone.now().strftime('%Y-%m-%d'))

        if not start_date:
            earliest_phone = PhoneNumber.objects.aggregate(Min('created_at'))['created_at__min']
            start_date = earliest_phone.strftime('%Y-%m-%d') if earliest_phone else timezone.now().strftime('%Y-%m-%d')

        start_date = parse_date(start_date, timezone.now())
        end_date = parse_date(end_date, timezone.now())

        return PhoneNumber.objects.annotate(
            missed_calls=Count(Case(
                When(call_histories__status='Missed', call_histories__created_at__range=(start_date, end_date), then=1),
                output_field=IntegerField(),
            )),
            completed_calls=Count(Case(
                When(call_histories__status='Completed', call_histories__created_at__range=(start_date, end_date), then=1),
                output_field=IntegerField(),
            )),
            average_duration=Avg(Case(
                When(call_histories__status='Completed', call_histories__created_at__range=(start_date, end_date), then='call_histories__duration'),
                output_field=IntegerField(),
            ))
        )

class CallHistoryList(generics.ListAPIView):
    serializer_class = CallHistorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['counterparty', 'call_type', 'status', 'created_at', 'duration']
    ordering = ['created_at']  # Default ordering

    def get_queryset(self):
        phone_number = self.kwargs.get('phone_number')
        phone = get_object_or_404(PhoneNumber, number=phone_number)
        start_date = self.request.query_params.get('start_date', phone.created_at.strftime('%Y-%m-%d'))
        end_date = self.request.query_params.get('end_date', timezone.now().strftime('%Y-%m-%d'))

        start_date = parse_date(start_date, phone.created_at)
        end_date = parse_date(end_date, timezone.now())

        return CallHistory.objects.filter(
            phone_number=phone, created_at__range=(start_date, end_date))

    def list(self, request, *args, **kwargs):
        try:
            return super(CallHistoryList, self).list(request, *args, **kwargs)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
