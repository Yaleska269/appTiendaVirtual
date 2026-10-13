import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import CatalogoScreen from "../Screens/CatalogoScreen";
import AdminProductosScreen from "../Screens/AdminProductosScreen";
import FormularioProductoScreen from "../Screens/FormularioProductoScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminProductosNavegacion() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AdminProductosScreen"
                component={AdminProductosScreen}
                options={{ title: "Admin Productos" }}
            />
            <Stack.Screen
                name="FormularioProductoScreen"
                component={FormularioProductoScreen}
                options={{ title: "Formulario de producto" }}
            />
        </Stack.Navigator>
    );
}

export default function Navegacion() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarActiveTintColor: "#7C7CFF",
                    tabBarInactiveTintColor: "#777777",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => {
                        const iconos = {
                            Catalogo: "storefront-outline",
                            "Admin Productos": "create-outline",
                        };

                        return (
                            <Ionicons
                                name={iconos[route.name]}
                                size={size}
                                color={color}
                            />
                        );
                    },
                })}
            >
                <Tab.Screen
                    name="Catalogo"
                    component={CatalogoScreen}
                    options={{ title: "Catálogo" }}
                />
                <Tab.Screen
                    name="Admin Productos"
                    component={AdminProductosNavegacion}
                    options={{ title: "Admin Productos" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
