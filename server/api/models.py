from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models import Index


class PhoneNumber(models.Model):
    number = PhoneNumberField(null=False, blank=False,
                              unique=True, primary_key=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    discontinued_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        status = 'active' if self.is_active else f'discontinued on {self.discontinued_at.strftime("%Y-%m-%d") if self.discontinued_at else "unknown"}'
        return f"{self.number} ({status})"


class CallHistory(models.Model):
    phone_number = models.ForeignKey(
        'PhoneNumber', on_delete=models.CASCADE, related_name='call_histories')
    created_at = models.DateTimeField()
    counterparty = PhoneNumberField(null=False, blank=False)
    call_type = models.CharField(max_length=8, choices=(
        ('Inbound', 'Inbound'), ('Outbound', 'Outbound')))
    status = models.CharField(max_length=9, choices=(
        ('Completed', 'Completed'), ('Missed', 'Missed')))
    duration = models.PositiveSmallIntegerField(
        null=True, blank=True)  # Null for missed calls

    class Meta:
        indexes = [
            Index(fields=['phone_number', 'created_at']),
        ]


    def __str__(self):
        return f"{self.call_type} {self.status} call on {self.created_at.strftime('%Y-%m-%d %H:%M:%S')} to/from {self.counterparty}"
