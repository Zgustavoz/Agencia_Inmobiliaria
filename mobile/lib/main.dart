import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mobile/firebase_options.dart';
import 'package:mobile/src/shared/services/notification_service.dart';
import 'package:mobile/src/features/auth/presentation/login_screen.dart';
import 'package:mobile/src/features/contracts/logic/contrato_provider.dart';
import 'package:mobile/src/features/properties/presentation/pages/destacados_screen.dart';
import 'package:mobile/src/features/properties/logic/propiedad_provider.dart';
import 'package:mobile/src/features/properties/logic/visita_provider.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/features/auth/logic/user_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    
    // Inicializar servicio de notificaciones (no bloqueante para que la app arranque)
    NotificationService.initialize().catchError((e) {
      print("Error inicializando notificaciones: $e");
    });
  } catch (e) {
    print("Error inicializando Firebase: $e");
  }

  try {
    await dotenv.load(fileName: ".env");
  } catch (e) {
    print("Error cargando .env: $e");
    // Puedes decidir si continuar o no sin .env
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => ContratoProvider()),
        ChangeNotifierProvider(create: (_) => PropiedadProvider()),
        ChangeNotifierProvider(create: (_) => VisitaProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(360, 690),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Agencia Inmobiliaria',
          localizationsDelegates: const [
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('es', 'BO'),
            Locale('en', 'US'),
          ],
          locale: const Locale('es', 'BO'),
          theme: ThemeData(
            primarySwatch: Colors.orange,
            fontFamily: 'Inter',
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFFF16621),
            ),
          ),
          initialRoute: '/',
          routes: {
            '/': (context) => const LoginScreen(),
            '/destacados': (context) => const DestacadosScreen(),
          },
        );
      },
    );
  }
}
