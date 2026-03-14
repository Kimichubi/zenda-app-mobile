import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react-native";
import { api } from "../services/api";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../hooks/use-auth-store";

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { setUser, setToken } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;
      
      await SecureStore.setItemAsync("zenda_token", accessToken);
      setToken(accessToken);
      setUser(user);
      
      // Navigation will be handled by the root App component based on store state
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-24 pb-12 justify-between">
          <View>
            <View className="w-16 h-16 rounded-3xl bg-indigo-600 items-center justify-center shadow-xl shadow-indigo-200 mb-12">
              <Zap color="white" size={32} fill="white" opacity={0.2} />
            </View>
            
            <Text className="text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-slate-900 mb-4">
              Zenda{"\n"}
              <Text className="text-indigo-600">Authority.</Text>
            </Text>
            
            <Text className="text-lg font-medium text-slate-500 max-w-[280px]">
              Gerencie seu tempo com a precisão que seu negócio exige.
            </Text>
          </View>

          <View className="space-y-6">
            {error ? (
              <View className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <Text className="text-red-600 text-sm font-bold">{error}</Text>
              </View>
            ) : null}

            <View className="space-y-4">
              <View className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex-row items-center">
                <Mail size={20} color="#64748b" />
                <TextInput 
                  placeholder="Email Profissional"
                  className="flex-1 ml-3 text-slate-900 font-medium"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex-row items-center">
                <Lock size={20} color="#64748b" />
                <TextInput 
                  placeholder="Senha"
                  className="flex-1 ml-3 text-slate-900 font-medium"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              className="bg-slate-900 h-16 rounded-3xl items-center justify-center flex-row shadow-xl shadow-slate-300"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white font-black uppercase tracking-widest text-xs mr-2">Entrar no Terminal</Text>
                  <ArrowRight size={16} color="white" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity className="items-center py-4">
              <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Ainda não tem conta? <Text className="text-indigo-600">Criar agora</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
