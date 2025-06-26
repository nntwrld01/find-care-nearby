from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class MapboxTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"token": settings.MAPBOX_TOKEN})
