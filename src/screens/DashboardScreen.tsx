import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl
} from "react-native";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  Zap, 
  ChevronRight,
  Bell
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { formatCurrency } from "../utils";
import { useAuthStore } from "../hooks/use-auth-store";

export function DashboardScreen() {
  const { user } = useAuthStore();
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await api.get("/dashboard/summary");
      return response.data;
    }
  });

  const cards = [
    { 
      label: "Faturamento", 
      value: formatCurrency(data?.todayRevenue || 0), 
      icon: TrendingUp, 
      color: "#10b981",
      bg: "#ecfdf5"
    },
    { 
      label: "Atendimentos", 
      value: String(data?.todayAppointments?.length || 0), 
      icon: Calendar, 
      color: "#4f46e5",
      bg: "#eef2ff"
    },
    { 
      label: "Próximos", 
      value: String(data?.upcomingAppointments?.length || 0), 
      icon: Clock, 
      color: "#8b5cf6",
      bg: "#f5f3ff"
    },
    { 
      label: "Clientes", 
      value: "...", // Endpoint simplificado
      icon: Users, 
      color: "#f59e0b",
      bg: "#fffbeb"
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-8 py-6 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Overview</Text>
          <Text className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Dashboard</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center border border-slate-100 shadow-sm">
          <Bell size={20} color="#1e293b" />
          <View className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full border border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {/* Welcome Card */}
        <View className="bg-indigo-600 rounded-[2.5rem] p-8 mb-8 shadow-xl shadow-indigo-200 overflow-hidden relative">
          <View className="relative z-10">
            <Text className="text-indigo-200 font-bold uppercase tracking-widest text-[10px] mb-2">Bem-vindo de volta</Text>
            <Text className="text-white text-3xl font-black tracking-tight mb-2">{user?.name?.split(' ')[0]}</Text>
            <Text className="text-indigo-100 opacity-80 text-sm font-medium leading-relaxed max-w-[200px]">
              Seu negócio cresceu <Text className="text-white font-bold">12%</Text> esta semana. Continue assim.
            </Text>
          </View>
          <Zap size={120} color="white" opacity={0.05} style={{ position: 'absolute', right: -20, bottom: -20 }} />
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between">
          {cards.map((card, i) => (
            <View 
              key={i} 
              style={{ width: '47%' }} 
              className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm border border-slate-100"
            >
              <View 
                style={{ backgroundColor: card.bg }} 
                className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
              >
                <card.icon size={24} color={card.color} />
              </View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</Text>
              <Text className="text-xl font-black tracking-tighter text-slate-900">{card.value}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View className="mt-4">
          <View className="flex-row justify-between items-end mb-6 px-2">
            <Text className="text-xl font-black tracking-tighter uppercase italic text-slate-900">Agenda Hoje</Text>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Ver Todos</Text>
            </TouchableOpacity>
          </View>

          {data?.todayAppointments?.slice(0, 3).map((apt: any, i: number) => (
            <TouchableOpacity 
              key={i}
              className="bg-white rounded-[2rem] p-5 mb-4 flex-row items-center justify-between border border-slate-100 shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center border border-slate-100">
                  <Text className="text-xs font-black text-slate-900 uppercase">{apt.startTime?.slice(0, 5)}</Text>
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-base font-black tracking-tight text-slate-900">{apt.clientName}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{apt.serviceName}</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#cbd5e1" />
            </TouchableOpacity>
          ))}

          {(!data?.todayAppointments || data.todayAppointments.length === 0) && (
            <View className="bg-white rounded-[2rem] p-10 items-center justify-center border border-dashed border-slate-200">
              <Text className="text-slate-400 italic font-medium">Nenhum agendamento para hoje</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
