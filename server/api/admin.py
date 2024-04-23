from django.contrib import admin
from .models import PhoneNumber, CallHistory

class PhoneNumberAdmin(admin.ModelAdmin):
    list_display = ('number', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('number',)

class CallHistoryAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'counterparty', 'call_type', 'status', 'duration', 'created_at')
    list_filter = ('call_type', 'status')
    search_fields = ('phone_number__number', 'counterparty')

admin.site.register(PhoneNumber, PhoneNumberAdmin)
admin.site.register(CallHistory, CallHistoryAdmin)