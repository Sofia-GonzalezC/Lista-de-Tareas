from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.registro, name='registro'),
    path('iniciar_sesion/', views.iniciar_sesion, name='iniciar_sesion'),
    path('api/tareas/', views.TareaList.as_view(), name='tarea-list'),
    path('api/tareas/<int:pk>/', views.TareaDetail.as_view(), name='tarea-detail'),
]