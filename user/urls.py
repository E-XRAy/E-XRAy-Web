from django.urls import path,include
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name="user/index.html"),name='xray-home'),
    ]