from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from .models import Hospital, Service
from .serializers import HospitalSerializer, ServiceSerializer
from django.shortcuts import get_object_or_404
import secrets

# Simple in-memory token store for demo purposes (replace with real tokens in prod)
TOKENS = {}

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_update(self, serializer):
        # Only allow a hospital to update itself
        hospital = self.request.user
        serializer.save(id=hospital.id)

from rest_framework.decorators import api_view
from rest_framework.authentication import get_authorization_header

@api_view(['GET'])
def current_hospital(request):
    """
    Return the current authenticated hospital using the demo token auth.
    """
    auth = get_authorization_header(request).decode('utf-8')
    if not auth.startswith('Token '):
        return Response({'error': 'No token provided'}, status=401)
    token = auth.split(' ')[1]
    hospital_id = TOKENS.get(token)
    if not hospital_id:
        return Response({'error': 'Invalid token'}, status=401)
    try:
        hospital = Hospital.objects.get(id=hospital_id)
    except Hospital.DoesNotExist:
        return Response({'error': 'Hospital not found'}, status=404)
    return Response(HospitalSerializer(hospital).data)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

class HospitalRegisterView(generics.CreateAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['password'] = make_password(data['password'])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        hospital = serializer.save()
        return Response(HospitalSerializer(hospital).data, status=status.HTTP_201_CREATED)

class HospitalLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(f"Login attempt: email={email}, password={password}")
        try:
            hospital = Hospital.objects.get(email=email)
        except Hospital.DoesNotExist:
            print("No hospital found with that email.")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        print(f"Hospital password in DB: {hospital.password}")
        if check_password(password, hospital.password):
            token = secrets.token_hex(32)
            TOKENS[token] = hospital.id
            print("Login successful!")
            return Response({'token': token, 'hospital_id': hospital.id})
        print("Password check failed.")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
