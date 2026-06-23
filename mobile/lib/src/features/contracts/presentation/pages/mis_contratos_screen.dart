import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/src/features/auth/logic/user_provider.dart';
import 'package:mobile/src/features/contracts/data/contrato_model.dart';
import 'package:mobile/src/features/contracts/logic/contrato_provider.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class MisContratosScreen extends StatefulWidget {
  const MisContratosScreen({super.key});

  @override
  State<MisContratosScreen> createState() => _MisContratosScreenState();
}

class _MisContratosScreenState extends State<MisContratosScreen>
    with WidgetsBindingObserver {
  bool _debeRefrescarAlVolver = false;
  int? _pagoPendienteConfirmarId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _cargarContratos();
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _debeRefrescarAlVolver) {
      _debeRefrescarAlVolver = false;
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          _confirmarPagoYRecargar();
        }
      });
    }
  }

  Future<void> _cargarContratos() async {
    final userProvider = context.read<UserProvider>();
    final user = userProvider.usuario;
    final token = userProvider.token;

    if (user == null || token == null) return;

    await context.read<ContratoProvider>().cargarMisContratosPendientes(
          userId: user.id,
          token: token,
        );
  }

  Future<void> _pagarCuota(PagoContratoMobile pago) async {
    final userProvider = context.read<UserProvider>();
    final token = userProvider.token;

    if (token == null) {
      _mostrarMensaje("Tu sesion expiro. Inicia sesion nuevamente.");
      return;
    }

    final provider = context.read<ContratoProvider>();
    final checkoutUrl = await provider.crearCheckoutPagoContrato(
      idPago: pago.idPago,
      token: token,
    );

    if (checkoutUrl == null) {
      _mostrarMensaje(provider.error ?? "No se pudo preparar el pago.");
      return;
    }

    final uri = Uri.tryParse(checkoutUrl);
    if (uri == null) {
      _mostrarMensaje("Stripe devolvio una URL invalida.");
      return;
    }

    final opened = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!opened) {
      _mostrarMensaje("No se pudo abrir Stripe Checkout.");
      return;
    }

    _debeRefrescarAlVolver = true;
    _pagoPendienteConfirmarId = pago.idPago;

    if (!mounted) return;
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text("Pago abierto en Stripe. Al volver, actualiza tus pagos."),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: "Actualizar",
          textColor: Colors.white,
          onPressed: _cargarContratos,
        ),
      ),
    );
  }

  Future<void> _confirmarPagoYRecargar() async {
    final userProvider = context.read<UserProvider>();
    final token = userProvider.token;
    final idPago = _pagoPendienteConfirmarId;

    if (token != null && idPago != null) {
      final confirmado = await context.read<ContratoProvider>().confirmarPagoContrato(
            idPago: idPago,
            token: token,
          );

      if (confirmado && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Pago confirmado correctamente."),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }

    _pagoPendienteConfirmarId = null;
    await _cargarContratos();
  }

  void _mostrarMensaje(String mensaje) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensaje),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ContratoProvider>(context);

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text("Mis Contratos"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            tooltip: "Actualizar pagos",
            onPressed: _cargarContratos,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _cargarContratos,
        color: const Color(0xFFF16621),
        child: provider.isLoading
            ? const Center(
                child: CircularProgressIndicator(color: Color(0xFFF16621)),
              )
            : provider.misContratosPendientes.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: EdgeInsets.all(16.w),
                    itemCount: provider.misContratosPendientes.length,
                    itemBuilder: (context, index) {
                      final contrato = provider.misContratosPendientes[index];
                      return _buildContratoCard(contrato);
                    },
                  ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      children: [
        SizedBox(height: 160.h),
        Icon(
          Icons.description_outlined,
          size: 82.sp,
          color: Colors.grey.shade300,
        ),
        SizedBox(height: 18.h),
        Text(
          "No tienes contratos con pagos pendientes",
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 16.sp,
            color: Colors.grey.shade600,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 8.h),
        Text(
          "Cuando tengas cuotas por pagar, apareceran aqui.",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12.sp, color: Colors.grey.shade500),
        ),
      ],
    );
  }

  Widget _buildContratoCard(ContratoMobile contrato) {
    final proximoPago = contrato.proximoPago;

    return Container(
      margin: EdgeInsets.only(bottom: 16.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  contrato.codigoContrato,
                  style: TextStyle(
                    fontSize: 17.sp,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF191C1E),
                  ),
                ),
              ),
              _buildBadge("${contrato.pagosPendientes.length} pendiente(s)"),
            ],
          ),
          SizedBox(height: 12.h),
          _buildInfoRow(Icons.home_work_outlined, contrato.propiedad),
          SizedBox(height: 8.h),
          _buildInfoRow(Icons.attach_money, "Monto contrato: \$${contrato.monto}"),
          SizedBox(height: 8.h),
          _buildInfoRow(
            Icons.date_range_outlined,
            "Desde ${contrato.fechaInicio} hasta ${contrato.fechaFin ?? 'sin fecha fin'}",
          ),
          if ((contrato.condiciones ?? '').isNotEmpty) ...[
            SizedBox(height: 12.h),
            Text(
              "Condiciones",
              style: TextStyle(
                fontSize: 12.sp,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade700,
              ),
            ),
            SizedBox(height: 4.h),
            Text(
              contrato.condiciones!,
              style: TextStyle(
                fontSize: 12.sp,
                color: Colors.grey.shade600,
                height: 1.35,
              ),
            ),
          ],
          if (proximoPago != null) ...[
            const Divider(height: 26),
            _buildProximoPago(proximoPago),
          ],
          SizedBox(height: 14.h),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => _mostrarPagosPendientes(contrato),
              icon: const Icon(Icons.receipt_long_outlined),
              label: const Text("Ver pagos"),
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFFF16621),
                side: const BorderSide(color: Color(0xFFF16621)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.r),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String text) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 5.h),
      decoration: BoxDecoration(
        color: const Color(0xFFF16621).withOpacity(0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: const Color(0xFFF16621),
          fontSize: 10.sp,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 17.sp, color: Colors.grey.shade500),
        SizedBox(width: 8.w),
        Expanded(
          child: Text(
            text,
            style: TextStyle(fontSize: 12.5.sp, color: Colors.grey.shade700),
          ),
        ),
      ],
    );
  }

  Widget _buildProximoPago(PagoContratoMobile pago) {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: const Color(0xFFF16621).withOpacity(0.2)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: const Color(0xFFF16621),
            child: Icon(Icons.payments_outlined, color: Colors.white, size: 20.sp),
          ),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Proxima cuota pendiente",
                  style: TextStyle(
                    fontSize: 12.sp,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF191C1E),
                  ),
                ),
                SizedBox(height: 3.h),
                Text(
                  "\$${pago.monto} vence el ${pago.fechaVencimiento}",
                  style: TextStyle(fontSize: 12.sp, color: Colors.grey.shade700),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _mostrarPagosPendientes(ContratoMobile contrato) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.r)),
      ),
      builder: (_) {
        return Consumer<ContratoProvider>(
          builder: (context, provider, _) {
            return SafeArea(
              child: Padding(
                padding: EdgeInsets.all(18.w),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            "Pagos pendientes",
                            style: TextStyle(
                              fontSize: 18.sp,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        TextButton.icon(
                          onPressed: _cargarContratos,
                          icon: const Icon(Icons.refresh, size: 18),
                          label: const Text("Actualizar"),
                        ),
                      ],
                    ),
                    SizedBox(height: 12.h),
                    ...contrato.pagosPendientes.map(
                      (pago) {
                        final pagando =
                            provider.isPaying && provider.pagoEnProcesoId == pago.idPago;

                        return ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(
                            Icons.receipt_long_outlined,
                            color: Color(0xFFF16621),
                          ),
                          title: Text("\$${pago.monto}"),
                          subtitle: Text("Vence: ${pago.fechaVencimiento}"),
                          trailing: ElevatedButton(
                            onPressed: provider.isPaying ? null : () => _pagarCuota(pago),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF16621),
                              foregroundColor: Colors.white,
                              disabledBackgroundColor: Colors.grey.shade300,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.r),
                              ),
                            ),
                            child: pagando
                                ? SizedBox(
                                    width: 16.w,
                                    height: 16.w,
                                    child: const CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Text("Pagar"),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
