import os
import random
from datetime import datetime, timedelta
from django.utils.timezone import make_aware

import django
os.environ["DJANGO_SETTINGS_MODULE"] = "callshistory.settings"
django.setup()

from api.models import PhoneNumber, CallHistory

def generate_phone_number():
    # Possible country codes
    country_codes = ['+1', '+44', '+33', '+49', '+91']
    # Generate a random 7-digit number
    number = ''.join([str(random.randint(0, 9)) for _ in range(10)])
    # Select a random country code and append the number
    return random.choice(country_codes) + number

def populate_phone_numbers():
    created_at = make_aware(datetime(2023, 1, 1))  # Standardizing the creation date

    for _ in range(20):  # Generating 20 phone numbers
        is_active = random.choices([True, False], weights=(98, 2), k=1)[0]
        discontinued_at = None
        if not is_active:
            discontinued_at = created_at + timedelta(days=random.randint(1, 365))

        PhoneNumber.objects.create(
            number=generate_phone_number(),
            is_active=is_active,
            created_at=created_at,
            discontinued_at=discontinued_at
        )

def populate_call_history():
    call_types = ['Inbound', 'Outbound']
    statuses = ['Completed', 'Missed']
    start_date = datetime(2023, 1, 1)
    end_date = datetime.now()

    for phone_number in PhoneNumber.objects.all():
        num_calls = random.randint(500, 1000)  # Random number of calls per phone
        for _ in range(num_calls):
            counterparty = generate_phone_number()
            call_type = random.choice(call_types)
            status = random.choice(statuses)
            duration = random.randint(1, 3600) if status == 'Completed' else None
            created_at = make_aware(random_date(start_date, end_date))

            CallHistory.objects.create(
                phone_number=phone_number,
                created_at=created_at,
                counterparty=counterparty,
                call_type=call_type,
                status=status,
                duration=duration
            )

def random_date(start, end):
    """Generate a random datetime between `start` and `end`."""
    delta = end - start
    int_delta = (delta.days * 86400) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

if __name__ == "__main__":
    print("Starting to populate data...")
    populate_phone_numbers()
    populate_call_history()
    print("Data populated successfully.")
