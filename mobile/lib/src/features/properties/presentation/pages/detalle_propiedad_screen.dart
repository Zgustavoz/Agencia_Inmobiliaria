import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mobile/src/features/properties/data/propiedad_model.dart';
import 'package:mobile/src/features/properties/presentation/pages/solicitar_visita_screen.dart';

class DetallePropiedadScreen extends StatelessWidget {
  final Propiedad propiedad;

  const DetallePropiedadScreen({super.key, required this.propiedad});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(20.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPriceSection(),
                  SizedBox(height: 15.h),
                  _buildTitleSection(),
                  const Divider(height: 40),
                  _buildCharacteristicsGrid(),
                  const Divider(height: 40),
                  _buildDescriptionSection(),
                  SizedBox(height: 30.h),
                  _buildLocationSection(),
                  SizedBox(height: 30.h),
                  _buildActionButtons(context),
                  SizedBox(height: 50.h),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 300.h,
      pinned: true,
      backgroundColor: const Color(0xFFF16621),
      flexibleSpace: FlexibleSpaceBar(
        background: propiedad.imagenes.isEmpty
            ? Image.network('https://via.placeholder.com/800x600', fit: BoxFit.cover)
            : PageView.builder(
                itemCount: propiedad.imagenes.length,
                itemBuilder: (context, index) {
                  return CachedNetworkImage(
                    imageUrl: propiedad.imagenes[index].url,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                    errorWidget: (context, url, error) => const Icon(Icons.error),
                  );
                },
              ),
      ),
      leading: CircleAvatar(
        backgroundColor: Colors.white.withOpacity(0.8),
        child: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      actions: [
        CircleAvatar(
          backgroundColor: Colors.white.withOpacity(0.8),
          child: IconButton(
            icon: const Icon(Icons.favorite_border, color: Colors.black),
            onPressed: () {},
          ),
        ),
        SizedBox(width: 15.w),
      ],
    );
  }

  Widget _buildPriceSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "${propiedad.moneda} ${propiedad.precio.toStringAsFixed(0)}",
              style: TextStyle(
                fontSize: 26.sp,
                fontWeight: FontWeight.bold,
                color: const Color(0xFFF16621),
              ),
            ),
            if (propiedad.modalidadOperacion.isNotEmpty)
              Text(
                propiedad.modalidadOperacion,
                style: TextStyle(fontSize: 14.sp, color: Colors.grey),
              ),
          ],
        ),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
          decoration: BoxDecoration(
            color: const Color(0xFFF16621).withOpacity(0.1),
            borderRadius: BorderRadius.circular(20.r),
          ),
          child: Text(
            propiedad.tipoInmueble,
            style: TextStyle(
              color: const Color(0xFFF16621),
              fontWeight: FontWeight.bold,
              fontSize: 12.sp,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTitleSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          propiedad.titulo,
          style: TextStyle(fontSize: 20.sp, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8.h),
        Row(
          children: [
            const Icon(Icons.location_on_outlined, size: 16, color: Colors.grey),
            SizedBox(width: 5.w),
            Expanded(
              child: Text(
                propiedad.zona,
                style: TextStyle(fontSize: 14.sp, color: Colors.grey.shade600),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCharacteristicsGrid() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _charItem(Icons.king_bed_outlined, "${propiedad.dormitorios}", "Dorm."),
        _charItem(Icons.bathtub_outlined, "${propiedad.banos}", "Baños"),
        _charItem(Icons.square_foot, "${propiedad.superficieTotal}", "m²"),
        _charItem(Icons.meeting_room_outlined, "${propiedad.ambientes}", "Amb."),
      ],
    );
  }

  Widget _charItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: Colors.grey.shade700, size: 28.sp),
        SizedBox(height: 5.h),
        Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.sp)),
        Text(label, style: TextStyle(color: Colors.grey, fontSize: 12.sp)),
      ],
    );
  }

  Widget _buildDescriptionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Descripción", style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.bold)),
        SizedBox(height: 10.h),
        Text(
          propiedad.descripcion,
          style: TextStyle(fontSize: 14.sp, height: 1.5, color: Colors.grey.shade800),
        ),
      ],
    );
  }

  Widget _buildLocationSection() {
    final lat = propiedad.latitud;
    final lon = propiedad.longitud;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Ubicación", style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.bold)),
        SizedBox(height: 15.h),
        Container(
          height: 200.h,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(15.r),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15.r),
            child: (lat != null && lon != null)
                ? FlutterMap(
                    options: MapOptions(
                      initialCenter: LatLng(lat, lon),
                      initialZoom: 16,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                        subdomains: const ['a', 'b', 'c', 'd'],
                        userAgentPackageName: 'com.agenciainmobiliaria.app',
                      ),
                      MarkerLayer(
                        markers: [
                          Marker(
                            point: LatLng(lat, lon),
                            width: 50,
                            height: 50,
                            child: const Icon(
                              Icons.location_on,
                              color: Color(0xFFF16621),
                              size: 45,
                            ),
                          ),
                        ],
                      ),
                    ],
                  )
                : const Center(child: Text("Ubicación no disponible")),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFF16621),
            minimumSize: Size(double.infinity, 50.h),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r)),
          ),
          onPressed: () {}, 
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.chat_bubble_outline, color: Colors.white),
              SizedBox(width: 10.w),
              const Text("Contactar por WhatsApp", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        SizedBox(height: 15.h),
        OutlinedButton(
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: Color(0xFFF16621)),
            minimumSize: Size(double.infinity, 50.h),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r)),
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SolicitarVisitaScreen(propiedad: propiedad)),
            );
          },
          child: const Text("Agendar Visita", style: TextStyle(color: Color(0xFFF16621), fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
