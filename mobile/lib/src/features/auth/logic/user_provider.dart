import 'package:flutter/material.dart';
import 'package:mobile/src/features/auth/data/usuario_model.dart';

class UserProvider with ChangeNotifier {
  Usuario? _usuario;
  String? _token;

  Usuario? get usuario => _usuario;
  String? get token => _token;

  void setUser(Usuario user, String token) {
    _usuario = user;
    _token = token;
    notifyListeners(); // Esto avisa a Flutter que debe redibujar el nombre
  }
}
