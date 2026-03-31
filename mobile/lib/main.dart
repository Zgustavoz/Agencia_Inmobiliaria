import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart'; // Importa aquí
import 'screens/login_screen.dart';
import 'screens/destacados_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Inicializa ScreenUtil aquí
    return ScreenUtilInit(
      designSize: const Size(360, 690), // Tamaño de diseño base (ancho, alto)
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Agencia Inmobiliaria',
          theme: ThemeData(
            primarySwatch: Colors.orange,
            fontFamily: 'Inter', // Si usas esta fuente
            useMaterial3: true,
          ),
          initialRoute: '/',
          routes: {
            '/': (context) => const LoginScreen(),
            '/destacados': (context) => const DestacadosScreen(),
            // ... tus otras rutas
          },
        );
      },
    );
  }
}
