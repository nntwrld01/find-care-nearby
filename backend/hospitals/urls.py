from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .mapbox_token import MapboxTokenView

router = DefaultRouter()
router.register(r'hospitals', views.HospitalViewSet, basename='hospital')
router.register(r'services', views.ServiceViewSet, basename='service')

urlpatterns = [
    path('hospitals/me/', views.current_hospital, name='current-hospital'),
    path('', include(router.urls)),
    path('register/', views.HospitalRegisterView.as_view(), name='hospital-register'),
    path('login/', views.HospitalLoginView.as_view(), name='hospital-login'),
    path('mapbox-token/', MapboxTokenView.as_view(), name='mapbox-token'),
]
