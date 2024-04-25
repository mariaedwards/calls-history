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
    """
    Parses a string into a datetime object.

    Args:
        date_str (str): A date string in the format '%m-%d-%Y'.
        default (datetime.datetime, optional): A default date to return if parsing fails. Defaults to None.

    Returns:
        datetime.datetime: The parsed date or the default date if parsing fails due to a ValueError.
    """
    try:
        return datetime.datetime.strptime(date_str, '%m-%d-%Y')
    except ValueError:
        return default

class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class to set standard pagination parameters for API views.
    """
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class PhoneNumberList(generics.ListAPIView):
    """
    API view to list and filter phone numbers based on date range with associated call statistics.
    """
    serializer_class = PhoneNumberSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """
        Overrides the default queryset to filter phone numbers by a start and end date range,
        and annotates with call statistics such as missed calls, completed calls, and average call duration.
        """
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date', timezone.now().strftime('%m-%d-%Y'))

        # Set default start date to the earliest 'created_at' date of PhoneNumber or to today's date if none exist.
        if not start_date:
            earliest_phone = PhoneNumber.objects.aggregate(Min('created_at'))['created_at__min']
            start_date = earliest_phone.strftime('%m-%d-%Y') if earliest_phone else timezone.now().strftime('%m-%d-%Y')

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
    """
    API view to list call history for a specific phone number filtered by a date range.
    """
    serializer_class = CallHistorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['counterparty', 'call_type', 'status', 'created_at', 'duration']
    ordering = ['created_at']  # Default ordering
    pagination_class = StandardResultsSetPagination  # Add pagination

    def get_queryset(self):
        """
        Retrieves the call history for a specific phone number, filtered by start and end dates.
        """
        phone_number = self.kwargs['phone_number']
        phone = get_object_or_404(PhoneNumber, number=phone_number)
        start_date = self.request.query_params.get('start_date', phone.created_at.strftime('%m-%d-%Y'))
        end_date = self.request.query_params.get('end_date', timezone.now().strftime('%m-%d-%Y'))

        start_date = parse_date(start_date, phone.created_at)
        end_date = parse_date(end_date, timezone.now())

        return CallHistory.objects.filter(
            phone_number=phone, created_at__range=(start_date, end_date))

    def list(self, request, *args, **kwargs):
        """
        Custom list method to handle potential ValueError from queryset operations and return appropriate error response.
        """
        try:
            return super(CallHistoryList, self).list(request, *args, **kwargs)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

