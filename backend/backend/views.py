from django.views.generic import View
from django.http import FileResponse, Http404
import os
from django.conf import settings

class FrontendAppView(View):
    def get(self, request):
        # Use BASE_DIR from Django settings if available
        try:
            base_dir = settings.BASE_DIR
        except Exception:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        index_path = os.path.join(base_dir, 'dist', 'index.html')
        if not os.path.exists(index_path):
            raise Http404('index.html not found, did you build the frontend?')
        return FileResponse(open(index_path, 'rb'))
