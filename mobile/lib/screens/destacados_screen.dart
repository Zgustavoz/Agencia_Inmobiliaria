import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DestacadosScreen extends StatelessWidget {
  const DestacadosScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      // Menú lateral derecho
      endDrawer: _buildRightMenu(context),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Padding(
          padding: EdgeInsets.all(10.w),
          child: Icon(
            Icons.search_rounded,
            color: const Color(0xFFF16621),
            size: 28.sp,
          ),
        ),
        actions: [
          // Botón que abre el menú de las 3 rayas
          Builder(
            builder: (context) => IconButton(
              icon: Icon(
                Icons.menu,
                color: const Color(0xFFF16621),
                size: 28.sp,
              ),
              onPressed: () => Scaffold.of(context).openEndDrawer(),
            ),
          ),
          SizedBox(width: 10.w),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // --- SECCIÓN HERO CON EL BUSCADOR (RESTAURADO) ---
            Stack(
              children: [
                Container(
                  height: 380.h,
                  width: double.infinity,
                  child: Image.network(
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800',
                    fit: BoxFit.cover,
                  ),
                ),
                Container(height: 380.h, color: Colors.black.withOpacity(0.3)),
                Positioned.fill(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Alquiler y venta de\ndepartamentos y casas\nen Bolivia",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24.sp,
                          fontWeight: FontWeight.bold,
                          shadows: const [
                            Shadow(blurRadius: 10, color: Colors.black45),
                          ],
                        ),
                      ),
                      SizedBox(height: 20.h),
                      // AQUÍ ESTÁ EL BUSCADOR QUE FALTABA
                      _buildFloatingSearch(),
                    ],
                  ),
                ),
              ],
            ),

            SizedBox(height: 30.h),

            // --- SECCIÓN DESTACADOS ---
            _buildDestacadosHeader(),
            SizedBox(height: 15.h),
            _buildHorizontalCarousel(),

            SizedBox(height: 40.h),

            // --- SECCIÓN AYUDA ---
            Text(
              "Mirá como InfoCasas\nte puede ayudar",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 22.sp, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20.h),
            _buildOrangeDrop(),
            SizedBox(height: 50.h),
          ],
        ),
      ),
    );
  }

  // --- WIDGET DEL BUSCADOR FLOTANTE ---
  Widget _buildFloatingSearch() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20.w),
      padding: EdgeInsets.all(10.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        borderRadius: BorderRadius.circular(15.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(child: _buildSmallDropdown("Venta")),
              SizedBox(width: 10.w),
              Expanded(child: _buildSmallDropdown("Casa, Depart...")),
            ],
          ),
          SizedBox(height: 10.h),
          Row(
            children: [
              Expanded(
                child: TextField(
                  style: TextStyle(fontSize: 13.sp),
                  decoration: const InputDecoration(
                    hintText: "Buscá por ubicación o p...",
                    hintStyle: TextStyle(fontSize: 12),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 10),
                  ),
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF16621),
                  borderRadius: BorderRadius.circular(8.r),
                ),
                padding: EdgeInsets.all(12.w),
                child: Icon(Icons.search, color: Colors.white, size: 20.sp),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSmallDropdown(String text) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(text, style: TextStyle(fontSize: 11.sp)),
          Icon(Icons.keyboard_arrow_down, size: 16.sp),
        ],
      ),
    );
  }

  // --- MENÚ LATERAL CON CERRAR SESIÓN ---
  Widget _buildRightMenu(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: Color(0xFFF16621)),
            child: Center(
              child: Text(
                "Panel Inmobiliario",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: const Text("Perfil"),
            onTap: () {},
          ),
          const Spacer(),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.redAccent),
            title: const Text(
              "Cerrar sesión",
              style: TextStyle(color: Colors.redAccent),
            ),
            onTap: () => Navigator.pushReplacementNamed(context, '/'),
          ),
          SizedBox(height: 20.h),
        ],
      ),
    );
  }

  // (Mantenemos los widgets de Carrusel y Gota Naranja igual que antes...)
  Widget _buildDestacadosHeader() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "Destacados",
            style: TextStyle(fontSize: 28.sp, fontWeight: FontWeight.bold),
          ),
          Text(
            "Mostrar más",
            style: TextStyle(color: const Color(0xFFF16621), fontSize: 14.sp),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalCarousel() {
    return SizedBox(
      height: 260.h,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.only(left: 20.w),
        children: [
          _card(
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
            "Duplex de lujo",
            "USD 49.000",
            const Color(0xFF009191),
          ),
          _card(
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
            "Equipetrol",
            "Preventa",
            const Color(0xFF004AC6),
          ),
          _buildMoreCard(),
        ],
      ),
    );
  }

  Widget _card(String url, String t, String p, Color c) {
    return Container(
      width: 200.w,
      margin: EdgeInsets.only(right: 15.w),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(15.r),
        child: Stack(
          children: [
            Image.network(url, height: 200.h, width: 200.w, fit: BoxFit.cover),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: EdgeInsets.all(10.w),
                color: c.withOpacity(0.9),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t,
                      style: TextStyle(color: Colors.white, fontSize: 11.sp),
                    ),
                    Text(
                      p,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16.sp,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMoreCard() {
    return Container(
      width: 100.w,
      height: 200.h,
      margin: EdgeInsets.only(right: 20.w, bottom: 60.h),
      decoration: BoxDecoration(
        color: const Color(0xFFF16621).withOpacity(0.1),
        borderRadius: BorderRadius.circular(15.r),
      ),
      child: Icon(Icons.arrow_forward_ios, color: const Color(0xFFF16621)),
    );
  }

  Widget _buildOrangeDrop() {
    return Container(
      width: 130.w,
      height: 100.h,
      decoration: BoxDecoration(
        color: const Color(0xFFF16621),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(50.r),
          topRight: Radius.circular(50.r),
          bottomRight: Radius.circular(50.r),
          bottomLeft: Radius.circular(10.r),
        ),
      ),
      child: Icon(Icons.search_rounded, color: Colors.white, size: 50.sp),
    );
  }
}
