from rest_framework import serializers
from ..models.fcm_device import FCMDevice

class FCMDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMDevice
        fields = ['fcm_token', 'dispositivo_id']

    def create(self, validated_data):
        user = self.context['request'].user
        token = validated_data.get('fcm_token')
        
        # Si el token ya existe para otro usuario, lo borramos o actualizamos
        # (Un token FCM es único por dispositivo/app)
        FCMDevice.objects.filter(fcm_token=token).delete()
        
        return FCMDevice.objects.create(usuario=user, **validated_data)
