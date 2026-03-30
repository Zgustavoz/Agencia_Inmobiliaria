# pylint: disable=C0114,C0115,C0116
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from .rol import Rol
from .permiso import Permiso

class UsuarioManager(BaseUserManager):

    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('El username es obligatorio')
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user  = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('es_admin', True)
        extra_fields.setdefault('estado', True)
        return self.create_user(username, email, password, **extra_fields)


class Usuario(AbstractBaseUser):
    nombres         = models.CharField(max_length=100)
    apellidos       = models.CharField(max_length=100)
    email           = models.EmailField(max_length=150, unique=True, blank=True, null=True)
    telefono        = models.CharField(max_length=30, blank=True, null=True)
    username        = models.CharField(max_length=50, unique=True)
    foto_url        = models.TextField(blank=True, null=True)
    estado          = models.BooleanField(default=True)
    es_admin        = models.BooleanField(default=False)
    es_online       = models.BooleanField(default=False)
    ultimo_acceso   = models.DateTimeField(blank=True, null=True)
    creado_en       = models.DateTimeField(auto_now_add=True)
    actualizado_en  = models.DateTimeField(auto_now=True)
    ci              = models.CharField(max_length=20, blank=True, null=True)
    direccion       = models.CharField(max_length=255, blank=True, null=True)
    ocupacion       = models.CharField(max_length=100, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True) 
    
    roles    = models.ManyToManyField(Rol,     through='UsuarioRol',    related_name='usuarios', blank=True)

    objects = UsuarioManager()

    USERNAME_FIELD  = 'username'
    REQUIRED_FIELDS = ['email', 'nombres', 'apellidos']

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.username

    @property
    def is_active(self):
        return self.estado

    @property
    def is_staff(self):
        return self.es_admin

    @property
    def is_superuser(self):
        return self.es_admin

    def has_perm(self, perm, obj=None):
        return self.es_admin

    def has_module_perms(self, app_label):
        return self.es_admin

    def get_permisos(self):
        if self.es_admin:
            return list(Permiso.objects.filter(estado=True).values('id', 'codigo', 'nombre'))
        return list(
            Permiso.objects.filter(
                roles__usuarios=self,
                roles__estado=True,
                estado=True
            ).distinct().values('id', 'codigo', 'nombre')
        )


class UsuarioRol(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    rol     = models.ForeignKey(Rol,     on_delete=models.CASCADE, db_column='id_rol')

    class Meta:
        db_table = 'usuario_rol'
        unique_together = ('usuario', 'rol')
