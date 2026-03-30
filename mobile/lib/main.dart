import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart'; // <--- AÑADE ESTO
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Architect HQ',

      // --- CONFIGURACIÓN DE IDIOMA PARA EL CALENDARIO ---
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('es', 'ES'), // Español
      ],

      // --------------------------------------------------
      theme: ThemeData(fontFamily: 'Inter', useMaterial3: true),

      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
      },
    );
  }
}
