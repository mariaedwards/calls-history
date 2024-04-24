import datetime
from django.test import TestCase
from .models import PhoneNumber, CallHistory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone

def get_yesterday():
    return timezone.now() - datetime.timedelta(days=1)

class PhoneNumberModelTest(TestCase):
    def test_string_representation(self):
        phone_number = PhoneNumber(number="+1234567890")
        self.assertEqual(str(phone_number), "+1234567890 (active)")

    def test_discontinued_status(self):
        phone_number = PhoneNumber(number="+1234567890", is_active=False)
        self.assertEqual(str(phone_number), "+1234567890 (discontinued on unknown)")

class CallHistoryModelTest(TestCase):
    def test_string_representation(self):
        phone = PhoneNumber.objects.create(number="+1234567890", is_active=True, created_at=get_yesterday())
        call = CallHistory(
            phone_number=phone,
            counterparty="+1987654321",
            call_type="Inbound",
            status="Completed",
            created_at=get_yesterday()
        )
        expected_str = f"Inbound Completed call on {call.created_at.strftime('%Y-%m-%d %H:%M:%S')} to/from +1987654321"
        self.assertEqual(str(call), expected_str)


class CallHistoryListViewTests(APITestCase):
    def setUp(self):
        self.phone = PhoneNumber.objects.create(number="+1234567890", is_active=True,  created_at=get_yesterday())
        self.call = CallHistory.objects.create(
            phone_number=self.phone,
            counterparty="+1987654321",
            call_type="Inbound",
            status="Completed",
            created_at=get_yesterday()
        )

    def test_view_returns_calls(self):
        url = reverse('call-history-list', kwargs={'phone_number': '+1234567890'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1, f"Expected 1 result, got {len(response.data['results'])}. Data: {response.data}")


class PhoneNumberListViewTests(APITestCase):
    def setUp(self):
        # This setup runs for each test, ensuring a clean slate
        PhoneNumber.objects.create(number="+1234567890", is_active=True, created_at=get_yesterday())
        PhoneNumber.objects.create(number="+2345678901", is_active=True, created_at=get_yesterday())

    def test_phone_number_list(self):
        url = reverse('phone-number-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)