class PropiedadImagen {
  final int id;
  final String url;
  final bool principal;
  final int orden;

  PropiedadImagen({
    required this.id,
    required this.url,
    required this.principal,
    required this.orden,
  });

  factory PropiedadImagen.fromJson(Map<String, dynamic> json) {
    return PropiedadImagen(
      id: json['id_imagen'] ?? 0,
      url: json['url_imagen'] ?? '',
      principal: json['principal'] ?? false,
      orden: json['orden_visual'] ?? 1,
    );
  }
}

class Propiedad {
  final int id;
  final String codigo;
  final String titulo;
  final String descripcion;
  final String tipoInmueble;
  final String modalidadOperacion;
  final double precio;
  final String moneda;
  final String zona;
  final double? latitud;
  final double? longitud;
  final int dormitorios;
  final int banos;
  final int ambientes;
  final double superficieTotal;
  final bool destacado;
  final List<PropiedadImagen> imagenes;

  Propiedad({
    required this.id,
    required this.codigo,
    required this.titulo,
    required this.descripcion,
    required this.tipoInmueble,
    required this.modalidadOperacion,
    required this.precio,
    required this.moneda,
    required this.zona,
    this.latitud,
    this.longitud,
    required this.dormitorios,
    required this.banos,
    required this.ambientes,
    required this.superficieTotal,
    required this.destacado,
    required this.imagenes,
  });

  factory Propiedad.fromJson(Map<String, dynamic> json) {
    var list = json['imagenes'] as List? ?? [];
    List<PropiedadImagen> imagenesList = list.map((i) => PropiedadImagen.fromJson(i)).toList();

    return Propiedad(
      id: json['id_propiedad'] ?? 0,
      codigo: json['codigo_propiedad'] ?? '',
      titulo: json['titulo'] ?? '',
      descripcion: json['descripcion'] ?? '',
      tipoInmueble: json['tipo_inmueble'] ?? '',
      modalidadOperacion: json['modalidad_operacion'] ?? '',
      precio: double.tryParse(json['precio'].toString()) ?? 0.0,
      moneda: json['nombre_moneda'] ?? 'USD',
      zona: json['nombre_zona'] ?? '',
      latitud: double.tryParse(json['latitud'].toString()),
      longitud: double.tryParse(json['longitud'].toString()),
      dormitorios: json['dormitorios'] ?? 0,
      banos: json['banos'] ?? 0,
      ambientes: json['ambientes'] ?? 0,
      superficieTotal: double.tryParse(json['superficie_total_m2'].toString()) ?? 0.0,
      destacado: json['destacada'] ?? false,
      imagenes: imagenesList,
    );
  }

  String get primeraImagen {
    if (imagenes.isEmpty) return 'https://via.placeholder.com/400';
    final principal = imagenes.firstWhere((img) => img.principal, orElse: () => imagenes.first);
    return principal.url;
  }
}
