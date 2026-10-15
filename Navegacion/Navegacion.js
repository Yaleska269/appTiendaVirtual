
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../firebase/config";

import LoginScreen from "../Screens/LoginScreen";
import RegistroScreen from "../Screens/RegistroScreen";
import CatalogoScreen from "../Screens/CatalogoScreen";
import AdminProductosScreen from "../Screens/AdminProductosScreen";
import FormularioProductoScreen from "../Screens/FormularioProductoScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function cerrarSesion(navigation) {
    Alert.alert("Cerrar sesión", "¿Deseas salir de tu cuenta?", [
        { text: "Cancelar", style: "cancel" },
        {
            text: "Salir",
            onPress: async () => {
                try {
                    await signOut(auth);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                    });
                } catch (error) {
                    Alert.alert("Error", "No se pudo cerrar la sesión.");
                }
            },
        },
    ]);
}

function ClienteTabs({ navigation }) {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#7C7CFF",
                tabBarInactiveTintColor: "#777777",
            }}
        >
            <Tab.Screen
                name="Catalogo"
                component={CatalogoScreen}
                options={{
                    title: "Catálogo",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="storefront-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="CuentaCliente"
                options={{
                    title: "Mi cuenta",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            >
                {() => (
                    <PantallaCuenta
                        rol="cliente"
                        cerrar={() => cerrarSesion(navigation)}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function AdminTabs({ navigation }) {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#7C7CFF",
                tabBarInactiveTintColor: "#777777",
            }}
        >
            <Tab.Screen
                name="AdminProductos"
                component={AdminProductosNavegacion}
                options={{
                    title: "Productos",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="create-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="CuentaAdmin"
                options={{
                    title: "Mi cuenta",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            >
                {() => (
                    <PantallaCuenta
                        rol="admin"
                        cerrar={() => cerrarSesion(navigation)}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function AdminProductosNavegacion() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AdminProductosScreen"
                component={AdminProductosScreen}
                options={{ title: "Administrar productos" }}
            />
            <Stack.Screen
                name="FormularioProductoScreen"
                component={FormularioProductoScreen}
                options={{ title: "Formulario de producto" }}
            />
        </Stack.Navigator>
    );
}

function PantallaCuenta({ rol, cerrar }) {
    const { View, Text, TouchableOpacity, StyleSheet } = require("react-native");

    return (
        <View style={stylesCuenta.contenedor}>
            <Ionicons name="person-circle-outline" size={90} color="#7C7CFF" />
            <Text style={stylesCuenta.titulo}>Mi cuenta</Text>
            <Text style={stylesCuenta.rol}>
                Rol: {rol === "admin" ? "Administrador" : "Cliente"}
            </Text>
            <TouchableOpacity style={stylesCuenta.boton} onPress={cerrar}>
                <Text style={stylesCuenta.textoBoton}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const stylesCuenta = {
    contenedor: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 12,
    },
    rol: {
        fontSize: 16,
        color: "#666666",
        marginVertical: 12,
    },
    boton: {
        backgroundColor: "#7C7CFF",
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
    },
    textoBoton: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
};

export default function Navegacion() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: "Iniciar sesión", headerShown: false }}
                />
                <Stack.Screen
                    name="Registro"
                    component={RegistroScreen}
                    options={{ title: "Crear cuenta" }}
                />
                <Stack.Screen
                    name="Cliente"
                    component={ClienteTabs}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                    name="Admin"
                    component={AdminTabs}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
