"""money_graph URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from money_graph.money_details.api import router as money_details_api
from money_graph.money_planner.api import router as money_planner_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/money-details/', include(money_details_api.urls)),
    path('api/money-planner/', include(money_planner_api.urls)),
    path('api-token-auth/', obtain_auth_token)
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')) # used for logging into the api
]
