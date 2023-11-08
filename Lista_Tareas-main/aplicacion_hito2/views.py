from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate
from django.contrib import messages
from rest_framework import generics, status
from .models import Tarea
from .serializers import TareaSerializer
from rest_framework import permissions
from rest_framework.response import Response

def registro(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('http://localhost:8000/aplicacion/iniciar_sesion/')
    else:
        form = UserCreationForm()
    return render(request, 'registro.html', {'form': form})

def iniciar_sesion(request):
    if request.method == 'POST':
        username = request.POST['usuario']
        password = request.POST['contraseña']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('http://localhost:3000/')
        else:
            messages.error(request, 'Credenciales inválidas. Por favor, inténtalo nuevamente.')

    return render(request, 'iniciar_sesion.html')

class TareaList(generics.ListCreateAPIView):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [permissions.AllowAny]

class TareaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        edited_title = request.data.get('titulo')
        edited_description = request.data.get('descripcion')
    
        instance.titulo = edited_title
        instance.descripcion = edited_description
        instance.save()

        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)