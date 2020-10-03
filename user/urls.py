from django.urls import path,include
from django.views.generic import TemplateView

urlpatterns = [
    path('home/', TemplateView.as_view(template_name="user/index.html"),name='xray-home'),
    path('', TemplateView.as_view(template_name="user/index2.html"),name='xray-home2'),
    path('web/', TemplateView.as_view(template_name="user/webdicom.html"),name='xray-web'),
    ]