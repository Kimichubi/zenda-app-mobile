import React from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  QrCode
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { formatCurrency, cn } from "../utils";

export function PaymentsScreen() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments-list"],
    queryFn: async () => {
      const response = await api.get("/payments");
      return response.data;
    }
  });

  const totalRevenue = payments.reduce((acc: number, p: any) => acc + p.amount, 0);
  const paidTotal = payments.filter((p: any) => p.status === "PAID").reduce((acc: number, p: any) => acc + p.amount, 0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 py-6 flex-row justify-between items-center border-b border-slate-100">
        <View>
          <Text className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Financial</Text>
          <Text className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Pagamentos</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center border border-slate-100">
          <TrendingUp size={20} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Mini Stats */}
      <View className="px-8 py-8 flex-row justify-between">
        <View className="flex-1 mr-4 bg-indigo-600 p-6 rounded-[2rem] shadow-lg shadow-indigo-200">
          <Text className="text-indigo-200 text-[8px] font-black uppercase tracking-widest mb-1">Total Bruto</Text>
          <Text className="text-xl font-black text-white">{formatCurrency(totalRevenue)}</Text>
        </View>
        <View className="flex-1 bg-emerald-500 p-6 rounded-[2rem] shadow-lg shadow-emerald-100">
          <Text className="text-emerald-100 text-[8px] font-black uppercase tracking-widest mb-1">Confirmado</Text>
          <Text className="text-xl font-black text-white">{formatCurrency(paidTotal)}</Text>
        </View>
      </View>

      {/* List */}
      <View className="flex-1 px-8">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">Histórico de Transações</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#4f46e5" />
        ) : (
          <FlatList
            data={payments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="bg-slate-50 rounded-[2.5rem] p-6 mb-6 border border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={cn(
                    "w-12 h-12 rounded-2xl items-center justify-center border shadow-sm",
                    item.status === "PAID" ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                  )}>
                    {item.status === "PAID" ? (
                      <CheckCircle2 size={20} color="#10b981" />
                    ) : (
                      <QrCode size={20} color="#f59e0b" />
                    )}
                  </View>
                  <View className="ml-4">
                    <Text className="text-base font-black tracking-tight text-slate-900">{item.clientName || "Cliente"}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.status === "PAID" ? "Recebimento Confirmado" : "Aguardando Pix"}
                    </Text>
                  </View>
                </View>
                <Text className={cn(
                  "text-lg font-black tracking-tighter",
                  item.status === "PAID" ? "text-emerald-600" : "text-slate-900"
                )}>
                  {formatCurrency(item.amount)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
