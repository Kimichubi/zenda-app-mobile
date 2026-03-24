import React, { useState } from "react";
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  ChevronRight, 
  Calendar,
  MoreVertical
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { clientsService, Client } from "../services/clients";
import { formatPhone } from "../utils";

export function ClientsScreen() {
  const [search, setSearch] = useState("");

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsService.list
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  );

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity 
      className="bg-white rounded-[2.5rem] p-6 mb-4 flex-row items-center justify-between border border-slate-100 shadow-sm"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-14 h-14 rounded-3xl bg-indigo-50 items-center justify-center border border-indigo-100">
          <Text className="text-xl font-black text-indigo-600 uppercase">
            {item.name.charAt(0)}
          </Text>
        </View>
        
        <View className="ml-5 flex-1">
          <Text className="text-lg font-black tracking-tight text-slate-900 mb-1">{item.name}</Text>
          <View className="flex-row items-center">
            <Phone size={12} color="#94a3b8" />
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              {formatPhone(item.phone)}
            </Text>
          </View>
        </View>
      </View>
      
      <View className="items-end">
        <View className="flex-row items-center mb-1">
          <Calendar size={12} color="#cbd5e1" />
          <Text className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">
            {item._count?.appointments || 0} visitas
          </Text>
        </View>
        <ChevronRight size={18} color="#e2e8f0" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-8 py-6 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Database</Text>
          <Text className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Clientes</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 rounded-2xl bg-slate-900 items-center justify-center shadow-lg shadow-slate-200">
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <View className="bg-white flex-row items-center px-5 h-14 rounded-3xl border border-slate-100 shadow-sm">
          <Search size={20} color="#94a3b8" />
          <TextInput 
            placeholder="Pesquisar por nome ou telefone..."
            className="flex-1 ml-3 text-slate-600 font-bold"
            placeholderTextColor="#cbd5e1"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* List */}
      <View className="flex-1 px-6">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#4f46e5" />
          </View>
        ) : (
          <FlatList
            data={filteredClients}
            keyExtractor={(item) => item.id}
            renderItem={renderClientItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-20 opacity-20">
                <User size={64} color="#94a3b8" />
                <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 italic">
                  {search ? "Nenhum resultado" : "Sua base está vazia"}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
