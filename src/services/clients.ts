import { api } from "./api";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status?: "ACTIVE" | "INACTIVE";
  lastAppointment?: string;
  _count?: {
    appointments: number;
  };
}

export const clientsService = {
  list: async () => {
    const response = await api.get<Client[]>("/clients");
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: Omit<Client, "id">) => {
    const response = await api.post<Client>("/clients", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Client>) => {
    const response = await api.patch<Client>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/clients/${id}`);
  }
};
