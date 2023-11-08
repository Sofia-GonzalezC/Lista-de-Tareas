from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone



class Tarea(models.Model):
    titulo = models.CharField(max_length=255, blank=False)
    descripcion = models.TextField(blank=False)
    completado = models.BooleanField(default=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    createdAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.titulo