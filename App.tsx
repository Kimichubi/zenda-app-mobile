import React, { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";

if (Platform.OS === "web") {
  require("./src/theme/web.css");
}
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { storage } from "./src/utils/storage";
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  CreditCard
} from "lucide-react-native";

import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { AgendaScreen } from "./src/screens/AgendaScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen";
import { useAuthStore } from "./src/hooks/use-auth-store";
import { api } from "./src/services/api";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const ScreenPlaceholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 40 }}>
    <Text style={{ fontSize: 32, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#e2e8f0', textAlign: 'center' }}>
      {route.name}
    </Text>
    <Text style={{ fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 4, color: '#94a3b8', marginTop: 12, textAlign: 'center' }}>
      Under Construction
    </Text>
  </View>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          paddingTop: 15,
          paddingBottom: 40,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#f8fafc",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#cbd5e1",
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "900",
          marginTop: 6,
          letterSpacing: 1,
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: "DASHBOARD",
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Agenda" 
        component={AgendaScreen} 
        options={{
          tabBarLabel: "AGENDA",
          tabBarIcon: ({ color, size }) => <CalendarIcon size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Clientes" 
        component={ScreenPlaceholder} 
        options={{
          tabBarLabel: "CLIENTES",
          tabBarIcon: ({ color, size }) => <Users size={22} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Pagamentos" 
        component={PaymentsScreen} 
        options={{
          tabBarLabel: "FINANCEIRO",
          tabBarIcon: ({ color, size }) => <CreditCard size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { token, setToken, setUser } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await storage.getItem("zenda_token");
        if (storedToken) {
          setToken(storedToken);
          try {
            const response = await api.get("/users/me");
            setUser(response.data);
          } catch (apiError) {
            console.log("Session expired or API unreachable");
            await storage.removeItem("zenda_token");
            setToken(null);
          }
        }
      } catch (e) {
        console.log("Error loading storage data", e);
      } finally {
        setInitializing(false);
      }
    }
    loadStorageData();
  }, [setToken, setUser]);

  if (initializing) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!token ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Main" component={TabNavigator} />
          )}
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
