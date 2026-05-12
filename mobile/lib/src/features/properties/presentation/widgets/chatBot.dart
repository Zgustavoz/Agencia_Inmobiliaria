class AIEstimatorChat extends StatefulWidget {
  const AIEstimatorChat({super.key});

  @override
  State<AIEstimatorChat> createState() => _AIEstimatorChatState();
}

class _AIEstimatorChatState extends State<AIEstimatorChat> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.r)),
      ),
      child: Column(
        children: [
          _buildHandle(),
          _buildHeader(),
          Expanded(child: _buildChatList()),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: EdgeInsets.all(20.w),
      child: Column(
        children: [
          Text(
            "Valuador IA Pro",
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              color: const Color(0xFFF16621),
            ),
          ),
          Text(
            "Envía una foto o audio para estimar el precio",
            style: TextStyle(fontSize: 12.sp, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 10.h),
      decoration: BoxDecoration(color: Colors.grey.shade100),
      child: SafeArea(
        child: Row(
          children: [
            // Botón para Imágenes
            IconButton(
              icon: const Icon(
                Icons.camera_alt_rounded,
                color: Color(0xFF434655),
              ),
              onPressed: () {
                /* Lógica de ImagePicker */
              },
            ),
            // Botón para Audio
            IconButton(
              icon: const Icon(Icons.mic_rounded, color: Color(0xFF434655)),
              onPressed: () {
                /* Lógica de Grabación */
              },
            ),
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  hintText: "Escribe detalles...",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(20.r),
                    borderSide: BorderSide.none,
                  ),
                  fillColor: Colors.white,
                  filled: true,
                  contentPadding: EdgeInsets.symmetric(horizontal: 15.w),
                ),
              ),
            ),
            SizedBox(width: 5.w),
            CircleAvatar(
              backgroundColor: const Color(0xFFF16621),
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white, size: 18),
                onPressed: () {
                  /* Enviar a la API de la IA */
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHandle() {
    return Container(
      margin: EdgeInsets.only(top: 10.h),
      width: 40.w,
      height: 5.h,
      decoration: BoxDecoration(
        color: Colors.grey.shade300,
        borderRadius: BorderRadius.circular(10.r),
      ),
    );
  }

  Widget _buildChatList() {
    return ListView(
      padding: EdgeInsets.all(15.w),
      children: [
        _chatBubble(
          "¡Hola! Soy tu asistente inmobiliario. ¿Tienes fotos de la propiedad o quieres describirla por audio?",
          false,
        ),
        // Aquí se irían agregando los mensajes
      ],
    );
  }

  Widget _chatBubble(String text, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 5.h),
        padding: EdgeInsets.all(12.w),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFFF16621) : Colors.grey.shade200,
          borderRadius: BorderRadius.circular(15.r),
        ),
        child: Text(
          text,
          style: TextStyle(color: isMe ? Colors.white : Colors.black87),
        ),
      ),
    );
  }
}
