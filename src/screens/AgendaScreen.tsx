import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  FlatList
} from "react-native";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock,
  CheckCircle2
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "../utils";

export function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments-week", format(weekStart, "yyyy-MM-dd")],
    queryFn: async () => {
      const response = await api.get(`/appointments/week?start=${format(weekStart, "yyyy-MM-dd")}`);
      return response.data;
    }
  });

  const dayAppointments = appointments.filter((apt: any) => 
    isSameDay(parseISO(apt.date), selectedDate)
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 py-6 flex-row justify-between items-center border-b border-slate-100">
        <View>
          <Text className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Schedule</Text>
          <Text className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Agenda</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center shadow-lg shadow-indigo-200">
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Week Calendar Selector */}
      <View className="py-6 border-b border-slate-50">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <TouchableOpacity 
                key={i}
                onPress={() => setSelectedDate(day)}
                className={cn(
                  "w-16 h-24 items-center justify-center rounded-[2rem] mr-4 border transition-all duration-300",
                  isSelected 
                    ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-300" 
                    : "bg-slate-50 border-slate-100"
                )}
              >
                <Text className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-2",
                  isSelected ? "text-indigo-400" : "text-slate-400"
                )}>
                  {format(day, "EEE", { locale: ptBR })}
                </Text>
                <Text className={cn(
                  "text-xl font-black",
                  isSelected ? "text-white" : "text-slate-900"
                )}>
                  {format(day, "dd")}
                </Text>
                {isToday && !isSelected && (
                  <View className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Appointments List */}
      <View className="flex-1 px-8 pt-8">
        <Text className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#4f46e5" />
          </View>
        ) : (
          <FlatList
            data={dayAppointments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-slate-50 rounded-[2.5rem] p-6 mb-6 flex-row items-center border border-slate-100 shadow-sm">
                <View className="w-16 h-16 rounded-3xl bg-white items-center justify-center border border-slate-100 shadow-inner">
                  <Text className="text-sm font-black text-slate-900">{item.startTime?.slice(0, 5)}</Text>
                </View>
                
                <View className="ml-5 flex-1">
                  <Text className="text-lg font-black tracking-tight text-slate-900">{item.clientName}</Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{item.serviceName}</Text>
                  </View>
                </View>

                {item.status === "CONFIRMED" && (
                  <CheckCircle2 size={24} color="#10b981" />
                )}
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-20 opacity-20">
                <CalendarIcon size={64} color="#94a3b8" />
                <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 italic">Nenhum registro</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Missing icon in empty component fix
import { Calendar as CalendarIcon } from "lucide-react-native";
