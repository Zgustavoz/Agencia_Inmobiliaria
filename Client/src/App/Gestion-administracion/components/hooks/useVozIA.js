import { useState, useRef } from "react";
import { intanciaAxios } from "../../../../config/axios";

export const useVozIA = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = async () => {
    return new Promise((resolve) => {
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        setIsRecording(false);
        // --- DEBUG: LOG DE TAMAÑO ---
        console.log("Tamaño del audio generado:", audioBlob.size, "bytes");
        // --- DEBUG: PRUEBA DE REPRODUCCIÓN (Escúchalo tú mismo) ---
        const urlBusqueda = URL.createObjectURL(audioBlob);
        const previewAudio = new Audio(urlBusqueda);
        previewAudio.play(); // El navegador debería sonar lo que grabaste
        console.log("Reproduciendo previsualización...");

        if (audioBlob.size < 1000) {
          console.error(
            "¡El audio es demasiado pequeño! Probablemente no se grabó nada.",
          );
        }

        // Enviar automáticamente al backend
        const resultado = await enviarAudio(audioBlob);
        resolve(resultado);
      };
      mediaRecorder.current.stop();
    });
  };

  const enviarAudio = async (blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio", blob, "reporte.webm");

    try {
      // USAMOS AXIOS: Nota que la ruta empieza DESPUÉS de la base URL de tu axios config
      // Basado en tu error 404, asegúrate que la ruta en Django sea exactamente esta:
      const { data } = await intanciaAxios.post(
        "/api/admin-config/reporte-voz/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error enviando audio:", error);
      setIsLoading(false);
      return { error: "Error de conexión" };
    }
  };

  return {
    isRecording,
    isLoading,
    startRecording,
    stopRecording,
  };
};
