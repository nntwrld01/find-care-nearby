from django.db import models
from django.contrib.auth.models import AbstractUser

class Hospital(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    phone = models.CharField(max_length=50)
    latitude = models.FloatField()
    longitude = models.FloatField()
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Will be hashed
    # Optionally: logo, description, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    hospital = models.ForeignKey(Hospital, related_name='services', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.hospital.name})"
