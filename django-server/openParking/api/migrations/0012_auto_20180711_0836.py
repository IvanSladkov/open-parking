# Generated by Django 2.0.7 on 2018-07-11 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20180710_1255'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parkingdata',
            name='geoLocation',
        ),
        migrations.AddField(
            model_name='parkingdata',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='parkingdata',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
