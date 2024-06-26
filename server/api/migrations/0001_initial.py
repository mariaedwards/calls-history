# Generated by Django 5.0.4 on 2024-04-23 01:22

import django.db.models.deletion
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PhoneNumber",
            fields=[
                (
                    "number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        max_length=128,
                        primary_key=True,
                        region=None,
                        serialize=False,
                        unique=True,
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("discontinued_at", models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="CallHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "counterparty",
                    phonenumber_field.modelfields.PhoneNumberField(
                        max_length=128, region=None
                    ),
                ),
                (
                    "call_type",
                    models.CharField(
                        choices=[("Inbound", "Inbound"), ("Outbound", "Outbound")],
                        max_length=10,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("Completed", "Completed"), ("Missed", "Missed")],
                        max_length=10,
                    ),
                ),
                ("duration", models.FloatField(blank=True, null=True)),
                (
                    "phone_number",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="call_histories",
                        to="api.phonenumber",
                    ),
                ),
            ],
        ),
    ]
