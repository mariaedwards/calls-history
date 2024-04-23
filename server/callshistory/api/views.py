from django.http import JsonResponse


def get_call_history(request, phone_number):
    # Dummy data simulation based on phone number
    call_history_data = {
        "+12345678901": [
            {"created_at": "2024-01-31T10:00:00Z", "counterparty": "+13333333333",
                "type": "Completed Inbound", "duration": "37.4"},
            {"created_at": "2024-01-31T11:00:00Z",
                "counterparty": "+14444444444", "type": "Missed Outbound"}
        ]
    }

    # Default response if phone number not found
    data = call_history_data.get(phone_number, [])
    return JsonResponse(data, safe=False)
