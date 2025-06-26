from rest_framework import serializers
from .models import Hospital, Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description']

    def create(self, validated_data):
        request = self.context.get('request')
        # Get hospital from token auth (like /api/hospitals/me/)
        from rest_framework.authentication import get_authorization_header
        from .views import TOKENS
        auth = get_authorization_header(request).decode('utf-8') if request else ''
        hospital = None
        if auth.startswith('Token '):
            token = auth.split(' ')[1]
            hospital_id = TOKENS.get(token)
            if hospital_id:
                from .models import Hospital
                hospital = Hospital.objects.get(id=hospital_id)
        if not hospital:
            raise serializers.ValidationError('Could not determine hospital for this request.')
        validated_data['hospital'] = hospital
        return super().create(validated_data)

class HospitalSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'address', 'phone', 'latitude', 'longitude',
            'email', 'password', 'services', 'created_at', 'updated_at'
        ]
        read_only_fields = ['services', 'created_at', 'updated_at']
