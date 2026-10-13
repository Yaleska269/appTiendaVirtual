
import React, { useEffect, useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
} from "react-native";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function FormularioProductoScreen({ navigation, route }) {
    const productoEditar = route.params?.producto || null;

    const [id, setId] = useState("");
    const [idcategoria, setIdcategoria] = useState("");
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [color, setColor] = useState("");
    const [imagen, setImagen] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [guardando, setGuardando] = useState(false);

    const mostrarMensaje = (titulo, mensaje) => {
        if (Platform.OS === "web" && typeof window !== "undefined") {
            window.alert(`${titulo}\n\n${mensaje}`);
        } else {
            Alert.alert(titulo, mensaje);
        }
    };

    useEffect(() => {
        if (productoEditar) {
            setId(String(productoEditar.id ?? ""));
            setIdcategoria(
                String(
                    productoEditar.idcategoria ??
                    productoEditar.idCategoria ??
                    productoEditar.categoriaId ??
                    ""
                )
            );
            setNombre(productoEditar.nombre || "");
            setPrecio(String(productoEditar.precio ?? ""));
            setColor(productoEditar.color || "");
            setImagen(productoEditar.imagen || "");
            setTiempo(String(productoEditar.tiempo ?? ""));
        } else {
            setId("");
            setIdcategoria("");
            setNombre("");
            setPrecio("");
            setColor("");
            setImagen("");
            setTiempo("");
        }
    }, [productoEditar]);

    const guardarProducto = async () => {
        if (
            id.trim() === "" ||
            idcategoria.trim() === "" ||
            nombre.trim() === "" ||
            precio.trim() === "" ||
            color.trim() === "" ||
            imagen.trim() === "" ||
            tiempo.trim() === ""
        ) {
            mostrarMensaje(
                "Campos incompletos",
                "Completá todos los campos."
            );
            return;
        }

        const idNumero = Number(id);
        const categoriaNumero = Number(idcategoria);
        const precioNumero = Number(precio.replace(",", "."));

        if (
            !Number.isFinite(idNumero) ||
            !Number.isFinite(categoriaNumero) ||
            !Number.isFinite(precioNumero)
        ) {
            mostrarMensaje(
                "Datos incorrectos",
                "El ID, la categoría y el precio deben ser números válidos."
            );
            return;
        }

        if (productoEditar && !productoEditar.documentId) {
            mostrarMensaje(
                "No se puede actualizar",
                "No se encontró el ID del documento en Firebase. Volvé a la lista y seleccioná el producto nuevamente."
            );
            return;
        }

        const producto = {
            id: idNumero,
            idcategoria: categoriaNumero,
            nombre: nombre.trim(),
            precio: precioNumero,
            color: color.trim(),
            imagen: imagen.trim(),
            tiempo: tiempo.trim(),
        };

        try {
            setGuardando(true);

            if (productoEditar) {
                const referencia = doc(
                    db,
                    "Productos",
                    productoEditar.documentId
                );

                await updateDoc(referencia, producto);

                mostrarMensaje(
                    "Éxito",
                    "Producto actualizado correctamente."
                );
            } else {
                await addDoc(collection(db, "Productos"), producto);

                mostrarMensaje(
                    "Éxito",
                    "Producto guardado correctamente."
                );
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error guardando producto:", error);
            console.error("Código:", error.code);
            console.error("Mensaje:", error.message);

            mostrarMensaje(
                "Error al guardar",
                `${error.code || "Sin código"}: ${error.message || "No se pudo guardar el producto."
                }`
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <ScrollView
            style={styles.contenedor}
            contentContainerStyle={styles.contenido}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.titulo}>
                {productoEditar ? "Editar producto" : "Agregar producto"}
            </Text>

            <Text style={styles.etiqueta}>ID del producto</Text>
            <TextInput
                style={styles.input}
                value={id}
                onChangeText={setId}
                placeholder="Ejemplo: 1"
                keyboardType="numeric"
            />

            <Text style={styles.etiqueta}>ID de categoría</Text>
            <TextInput
                style={styles.input}
                value={idcategoria}
                onChangeText={setIdcategoria}
                placeholder="Ejemplo: 2"
                keyboardType="numeric"
            />

            <Text style={styles.etiqueta}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre del producto"
            />

            <Text style={styles.etiqueta}>Precio</Text>
            <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                placeholder="Precio del producto"
                keyboardType="decimal-pad"
            />

            <Text style={styles.etiqueta}>Color</Text>
            <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="Ejemplo: #D8C4F1"
            />

            <Text style={styles.etiqueta}>URL de la imagen</Text>
            <TextInput
                style={styles.input}
                value={imagen}
                onChangeText={setImagen}
                placeholder="https://..."
                autoCapitalize="none"
                keyboardType="url"
            />

            <Text style={styles.etiqueta}>Tiempo</Text>
            <TextInput
                style={styles.input}
                value={tiempo}
                onChangeText={setTiempo}
                placeholder="Tiempo del producto"
            />

            <TouchableOpacity
                style={[
                    styles.botonGuardar,
                    guardando && styles.botonDeshabilitado,
                ]}
                onPress={guardarProducto}
                disabled={guardando}
            >
                <Text style={styles.textoBoton}>
                    {guardando
                        ? "Guardando..."
                        : productoEditar
                            ? "Actualizar producto"
                            : "Guardar producto"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => navigation.goBack()}
                disabled={guardando}
            >
                <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#F5F5F7",
    },
    contenido: {
        padding: 20,
        paddingBottom: 35,
    },
    titulo: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#222222",
        marginBottom: 20,
    },
    etiqueta: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 9,
        paddingHorizontal: 12,
        paddingVertical: 11,
        fontSize: 16,
    },
    botonGuardar: {
        backgroundColor: "#7C7CFF",
        padding: 14,
        borderRadius: 9,
        alignItems: "center",
        marginTop: 25,
    },
    botonDeshabilitado: {
        opacity: 0.6,
    },
    textoBoton: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    botonCancelar: {
        padding: 13,
        alignItems: "center",
        marginTop: 8,
    },
    textoCancelar: {
        color: "#555555",
        fontSize: 15,
    },
});
