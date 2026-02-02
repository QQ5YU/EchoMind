import { api } from "@shared/api";

export const audioApi = {
  getById: async (id: string): Promise<{ fileName: string }> => {
    const { data } = await api.get(`/api/audio/${id}`);
    return {
      fileName: data.originalName || data.fileName || "Unknown File",
    };
  },
};
