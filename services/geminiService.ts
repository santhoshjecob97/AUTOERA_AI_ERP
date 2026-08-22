import apiService from './api';

// Frontend-friendly AI wrapper.
// By default, the app will call a backend AI endpoint. Configure `VITE_USE_BACKEND_AI=true` in
// a local `.env` to enable this behavior. The backend mock implements `/api/gemini/generate/`.
export const generateAIInsight = async (context: string, userQuery: string): Promise<string> => {
  const useBackend = import.meta.env.VITE_USE_BACKEND_AI === 'true' || true;

  if (useBackend) {
    try {
      const response = await apiService.post<{ response: string; agent: string }>('/api/v1/ai/copilot/chat/', { prompt: userQuery, context });
      return response.response || 'No insight returned from AI Copilot.';
    } catch (err) {
      console.error('AI backend error:', err);
      return "AI backend unavailable. Please start the local backend or set `VITE_USE_BACKEND_AI=false`.";
    }
  }

  // Fallback short response if backend is disabled.
  return `I would analyze the context: ${context} and respond to: ${userQuery}`;
};