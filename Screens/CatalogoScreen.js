import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Image,
    Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Categoria from "../components/Categoria";

export default function CatalogoScreen() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const cargarProductos = async () => {
        try {
            const consulta = await getDocs(collection(db, "Productos"));

            const lista = consulta.docs.map((documento) => ({
                ...documento.data(),
                documentId: documento.id,
            }));

            setProductos(lista);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            Alert.alert("Error", "No se pudieron cargar los productos.");
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const productosFiltrados = productos.filter((producto) =>
        (producto.nombre || "")
            .toLowerCase()
            .includes(busqueda.trim().toLowerCase())
    );

    return (
        <View style={styles.pantalla}>
            <ScrollView
                style={styles.contenedor}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.buscador}>
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color="#7C7CFF"
                    />

                    <TextInput
                        placeholder="Buscar producto"
                        placeholderTextColor="#B5B5D5"
                        style={styles.input}
                        value={busqueda}
                        onChangeText={setBusqueda}
                    />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categorias}
                >
                    <Categoria nombre="Fashion" icono="shirt-outline" />
                    <Categoria nombre="Cars" icono="car-outline" />
                    <Categoria nombre="Babies" icono="woman-outline" />
                    <Categoria nombre="Home" icono="home-outline" />
                    <Categoria nombre="Sport" icono="bicycle-outline" />
                    <Categoria nombre="Technology" icono="laptop-outline" />
                </ScrollView>

                <View style={styles.linea} />

                <View style={styles.encabezado}>
                    <Text style={styles.titulo}>Productos</Text>
                    <Text style={styles.contador}>
                        {productosFiltrados.length} productos
                    </Text>
                </View>

                <View style={styles.productos}>
                    {productosFiltrados.length === 0 ? (
                        <Text style={styles.sinProductos}>
                            No hay productos registrados.
                        </Text>
                    ) : (
                        productosFiltrados.map((producto) => (
                            <View
                                key={producto.documentId}
                                style={[
                                    styles.tarjeta,
                                    {
                                        backgroundColor:
                                            producto.color || "#F5F5F5",
                                    },
                                ]}
                            >
                                {producto.imagen ? (
                                    <Image
                                        source={{ uri: producto.imagen }}
                                        style={styles.imagen}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.sinImagen}>
                                        <Ionicons
                                            name="image-outline"
                                            size={40}
                                            color="#999999"
                                        />
                                    </View>
                                )}

                                <View style={styles.informacion}>
                                    <Text
                                        style={styles.nombre}
                                        numberOfLines={2}
                                    >
                                        {producto.nombre || "Sin nombre"}
                                    </Text>

                                    <Text style={styles.precio}>
                                        C$ {producto.precio ?? 0}
                                    </Text>

                                    {producto.descripcion ? (
                                        <Text
                                            style={styles.descripcion}
                                            numberOfLines={2}
                                        >
                                            {producto.descripcion}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    contenedor: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 40,
    },
    buscador: {
        height: 55,
        backgroundColor: "#F5F4FC",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 12,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        fontSize: 12,
        marginLeft: 8,
        color: "#222222",
    },
    categorias: {
        marginBottom: 10,
    },
    linea: {
        height: 3,
        backgroundColor: "#AAAAAA",
        marginHorizontal: -10,
    },
    encabezado: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 10,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222222",
    },
    contador: {
        fontSize: 12,
        color: "#777777",
    },
    productos: {
        paddingBottom: 30,
    },
    tarjeta: {
        borderRadius: 12,
        marginBottom: 15,
        padding: 10,
        flexDirection: "row",
        minHeight: 150,
    },
    imagen: {
        width: 120,
        height: 130,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
    },
    sinImagen: {
        width: 120,
        height: 130,
        borderRadius: 10,
        backgroundColor: "#EEEEEE",
        justifyContent: "center",
        alignItems: "center",
    },
    informacion: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    nombre: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222222",
    },
    precio: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222222",
        marginTop: 6,
    },
    descripcion: {
        fontSize: 12,
        color: "#555555",
        marginTop: 4,
    },
    sinProductos: {
        textAlign: "center",
        color: "#777777",
        marginTop: 30,
        fontSize: 16,
    },
});
