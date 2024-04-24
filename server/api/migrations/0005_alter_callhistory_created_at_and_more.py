# Generated by Django 5.0.4 on 2024-04-24 17:16

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_callhistory_call_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='callhistory',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='phonenumber',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddIndex(
            model_name='callhistory',
            index=models.Index(fields=['phone_number', 'created_at'], name='api_callhis_phone_n_9ba1cb_idx'),
        ),
    ]
