// src/lib/api/endpoints.ts

// 📌 URL base de nuestro backend Python
//export const API_BASE = 'https://api-test5.utec.net.pe/vertex-ai-api/api/v1';
//export const API_BASE = 'https://0ee3cd91e591.ngrok-free.app/api/v1';
export const API_BASE = 'http://localhost:8000/api/v1';

/**
 * 📌 Mapeo de endpoints por entidad/módulo
 * - Evita usar strings mágicos en el código.
 * - Si mañana cambia la URL, solo actualizamos aquí.
 */
export const ENDPOINTS = {
  presentations: {
    create: `${API_BASE}/presentations`,
  },
  templates:{
    list:`${API_BASE}/templates`
  },
  chatbot: {
    sendMessage: `${API_BASE}/chatbot/send-message`,
  },
  instruction: {
    create: `${API_BASE}/instruction`,
  },
  quiz: {
    youtube:{
      generate: `${API_BASE}/quiz/youtube/generate`
    },
    evaluate:`${API_BASE}/quiz/evaluate`,
    generate: `${API_BASE}/quiz/generate`,
    save:`${API_BASE}/quiz/save`,
    get:`${API_BASE}/quiz`,
  }
};
