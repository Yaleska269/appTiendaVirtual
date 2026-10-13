
import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function AdminProductosScreen({ navigation }) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const mostrarMensaje = (titulo, mensaje) => {
        if (Platform.OS === "web" && typeof window !== "undefined") {
            window.alert(`${titulo}\n\n${mensaje}`);
        } else {
            Alert.alert(titulo, mensaje);
        }
    };

    const obtenerProductos = useCallback(async () => {
        try {
            setCargando(true);

            const consulta = await getDocs(collection(db, "Productos"));

            const datos = consulta.docs.map((documento) => ({
                ...documento.data(),
                documentId: documento.id,
            }));

            setProductos(datos);
        } catch (error) {
            console.error("Error obteniendo productos:", error);

            mostrarMensaje(
                "Error al consultar",
                `${error.code || "Sin código"}: ${error.message || "No fue posible consultar los productos."
                }`
            );
        } finally {
            setCargando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            obtenerProductos();
        }, [obtenerProductos])
    );

    const eliminarProducto = async (documentId) => {
        if (!documentId) {
            mostrarMensaje(
                "Error",
                "El producto no tiene un ID de documento válido."
            );
            return;
        }

        try {
            await deleteDoc(doc(db, "Productos", String(documentId)));

            setProductos((productosActuales) =>
                productosActuales.filter(
                    (producto) => producto.documentId !== documentId
                )
            );

            mostrarMensaje(
                "Producto eliminado",
                "El producto fue eliminado correctamente."
            );

            await obtenerProductos();
        } catch (error) {
            console.error("Error eliminando producto:", error);
            console.error("Código:", error.code);
            console.error("Mensaje:", error.message);

            mostrarMensaje(
                "Error al eliminar",
                `${error.code || "Sin código"}: ${error.message || "No fue posible eliminar el producto."
                }`
            );
        }
    };

    const confirmarEliminar = (producto) => {
        if (!producto.documentId) {
            mostrarMensaje(
                "Error",
                "No se encontró el ID del documento del producto."
            );
            return;
        }

        const mensaje = `¿Deseás eliminar "${producto.nombre || "este producto"}"?`;

        if (Platform.OS === "web" && typeof window !== "undefined") {
            const confirmado = window.confirm(mensaje);

            if (confirmado) {
                eliminarProducto(producto.documentId);
            }

            return;
        }

        Alert.alert("Eliminar producto", mensaje, [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => eliminarProducto(producto.documentId),
            },
        ]);
    };

    const renderProducto = ({ item }) => (
        <View style={styles.tarjeta}>
            <View style={styles.filaSuperior}>
                <Text style={styles.nombre}>
                    {item.nombre || "Sin nombre"}
                </Text>

                <View style={styles.botones}>
                    <TouchableOpacity
                        style={styles.botonEditar}
                        onPress={() =>
                            navigation.navigate("FormularioProductoScreen", {
                                producto: item,
                            })
                        }
                    >
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botonEliminar}
                        onPress={() => confirmarEliminar(item)}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.dato}>
                ID: {String(item.id ?? "")}
            </Text>

            <Text style={styles.dato}>
                Documento: {item.documentId}
            </Text>

            <Text style={styles.dato}>
                Precio: C$ {String(item.precio ?? 0)}
            </Text>

            <Text style={styles.dato}>
                Categoría: {String(
                    item.idcategoria ??
                    item.idCategoria ??
                    item.categoriaId ??
                    ""
                )}
            </Text>

            <Text style={styles.dato}>
                Color: {item.color || "Sin color"}
            </Text>

            <Text style={styles.dato}>
                Tiempo: {item.tiempo || "Sin tiempo"}
            </Text>
        </View>
    );

    return (
        <View style={styles.contenedor}>
            <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() =>
                    navigation.navigate("FormularioProductoScreen", {
                        producto: null,
                    })
                }
            >
                <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#FFFFFF"
                />
                <Text style={styles.textoBotonAgregar}>
                    Agregar producto
                </Text>
            </TouchableOpacity>

            <FlatList
                data={productos}
                keyExtractor={(item) => item.documentId}
                renderItem={renderProducto}
                refreshing={cargando}
                onRefresh={obtenerProductos}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={
                    !cargando ? (
                        <Text style={styles.vacio}>
                            No hay productos registrados.
                        </Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#F5F5F7",
        padding: 16,
    },
    lista: {
        paddingBottom: 20,
    },
    botonAgregar: {
        backgroundColor: "#7C7CFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
    },
    textoBotonAgregar: {
        color: "#FFFFFF",
        fontWeight: "bold",
        marginLeft: 8,
        fontSize: 16,
    },
    tarjeta: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
    },
    filaSuperior: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    nombre: {
        flex: 1,
        fontSize: 17,
        fontWeight: "bold",
        color: "#222222",
        marginRight: 8,
    },
    botones: {
        flexDirection: "row",
        gap: 8,
    },
    botonEditar: {
        backgroundColor: "#7C7CFF",
        padding: 8,
        borderRadius: 8,
    },
    botonEliminar: {
        backgroundColor: "#D93025",
        padding: 8,
        borderRadius: 8,
    },
    dato: {
        color: "#555555",
        fontSize: 14,
        marginTop: 4,
    },
    vacio: {
        textAlign: "center",
        color: "#666666",
        marginTop: 30,
        fontSize: 16,
    },
});
