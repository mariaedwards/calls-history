import os
import django
from django.db import transaction

# Set up the Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "callshistory.settings")
django.setup()

# Import models
from api.models import PhoneNumber, CallHistory
def delete_all_data():
    # Use a transaction to ensure all deletions complete successfully
    with transaction.atomic():
        # Delete CallHistory first to avoid integrity issues
        CallHistory.objects.all().delete()
        print("All call history records deleted.")

        # Handle PhoneNumber deletion
        phone_numbers = list(PhoneNumber.objects.all())
        for phone_number in phone_numbers:
            try:
                phone_number.delete()
            except ValueError as e:
                print(f"Error deleting {phone_number.number}: {e}")

if __name__ == "__main__":
    confirm = input("Are you sure you want to delete all data? Type 'yes' to confirm: ")
    if confirm.lower() == 'yes':
        delete_all_data()
        print("Data deletion completed successfully.")
    else:
        print("Data deletion canceled.")