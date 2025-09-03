// src/lib/api/endpoints.ts

// 📌 URL base de nuestro backend Python
//export const API_BASE = 'https://api-test5.utec.net.pe/vertex-ai-api/api/v1';
export const API_BASE = 'http://localhost:8000/api/v1';

/**
 * 📌 Mapeo de endpoints por entidad/módulo
 * - Evita usar strings mágicos en el código.
 * - Si mañana cambia la URL, solo actualizamos aquí.
 */
export const ENDPOINTS = {
  ppt: {
    generate: `${API_BASE}/ppt/generate-ppt`,
    template:{
      list:`${API_BASE}/template/list`
    }
  },
  chatbot: {
    sendMessage: `${API_BASE}/chatbot/send-message-chatbot`,
  },
  instruction: {
    generate: `${API_BASE}/instruction/generate-instruction`,
  },
  quiz: {
    youtube:{
      generate: `${API_BASE}/quiz/youtube/generate`
    }
  }
};
