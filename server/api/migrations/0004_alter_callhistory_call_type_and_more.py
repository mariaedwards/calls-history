# Generated by Django 5.0.4 on 2024-04-23 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_callhistory_duration'),
    ]

    operations = [
        migrations.AlterField(
            model_name='callhistory',
            name='call_type',
            field=models.CharField(choices=[('Inbound', 'Inbound'), ('Outbound', 'Outbound')], max_length=8),
        ),
        migrations.AlterField(
            model_name='callhistory',
            name='created_at',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='callhistory',
            name='duration',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='callhistory',
            name='status',
            field=models.CharField(choices=[('Completed', 'Completed'), ('Missed', 'Missed')], max_length=9),
        ),
        migrations.AlterField(
            model_name='phonenumber',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]