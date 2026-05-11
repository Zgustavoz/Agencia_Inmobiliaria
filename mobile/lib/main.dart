import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:mobile/src/features/auth/presentation/login_screen.dart';
import 'package:mobile/src/features/properties/presentation/pages/destacados_screen.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/features/auth/logic/user_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => UserProvider())],
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
