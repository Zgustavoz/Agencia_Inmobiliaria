import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mobile/src/features/properties/data/propiedad_model.dart';
import 'package:mobile/src/features/properties/presentation/pages/detalle_propiedad_screen.dart';

class PropertyCard extends StatelessWidget {
  final Propiedad propiedad;

  const PropertyCard({super.key, required this.propiedad});

  @override
  Widget build(BuildContext context) {
    // Definimos colores según el estilo del diseño original
    final Color cardColor = const Color(0xFF009191); 

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DetallePropiedadScreen(propiedad: propiedad),
          ),
        );
      },
      child: Container(
        width: 220.w,
        margin: EdgeInsets.only(right: 15.w),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(15.r),
          child: Stack(
            children: [
              CachedNetworkImage(
                imageUrl: propiedad.primeraImagen,
                height: 260.h,
                width: 220.w,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  color: Colors.grey.shade200,
                  child: const Center(child: CircularProgressIndicator()),
                ),
                errorWidget: (context, url, error) => const Icon(Icons.error),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: EdgeInsets.all(12.w),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        cardColor.withOpacity(0.95),
                        cardColor.withOpacity(0.7),
                        Colors.transparent,
                      ],
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        propiedad.titulo,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12.sp,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 2.h),
                      Text(
                        "${propiedad.moneda} ${propiedad.precio.toStringAsFixed(0)}",
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 17.sp,
                        ),
                      ),
                      SizedBox(height: 4.h),
                      Row(
                        children: [
                          const Icon(Icons.king_bed, color: Colors.white, size: 14),
                          SizedBox(width: 4.w),
                          Text(
                            "${propiedad.dormitorios}",
                            style: TextStyle(color: Colors.white, fontSize: 11.sp),
                          ),
                          SizedBox(width: 10.w),
                          const Icon(Icons.bathtub, color: Colors.white, size: 14),
                          SizedBox(width: 4.w),
                          Text(
                            "${propiedad.banos}",
                            style: TextStyle(color: Colors.white, fontSize: 11.sp),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              // Badge de "Destacado"
              if (propiedad.destacado)
                Positioned(
                  top: 10.h,
                  left: 10.w,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF16621),
                      borderRadius: BorderRadius.circular(5.r),
                    ),
                    child: Text(
                      "DESTACADO",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 8.sp,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
