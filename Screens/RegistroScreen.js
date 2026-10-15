
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function RegistroScreen({ navigation }) {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);

    const registrarUsuario = async () => {
        if (!nombre.trim() || !correo.trim() || !contrasena) {
            Alert.alert("Campos obligatorios", "Completa todos los campos.");
            return;
        }

        if (contrasena.length < 6) {
            Alert.alert(
                "Contraseña inválida",
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        try {
            setCargando(true);

            const credencial = await createUserWithEmailAndPassword(
                auth,
                correo.trim(),
                contrasena
            );

            const usuario = credencial.user;

            await setDoc(doc(db, "Usuarios", usuario.uid), {
                uid: usuario.uid,
                nombre: nombre.trim(),
                correo: usuario.email,
                rol: "cliente",
                fechaRegistro: serverTimestamp(),
            });

            Alert.alert(
                "Registro exitoso",
                "Tu cuenta se creó correctamente.",
                [
                    {
                        text: "Aceptar",
                        onPress: () => navigation.navigate("Login"),
                    },
                ]
            );
        } catch (error) {
            console.log("Error al registrar:", error.code, error.message);

            let mensaje = "No se pudo crear la cuenta. Inténtalo nuevamente.";

            if (error.code === "auth/email-already-in-use") {
                mensaje = "Este correo ya está registrado.";
            } else if (error.code === "auth/invalid-email") {
                mensaje = "El correo electrónico no es válido.";
            } else if (error.code === "auth/weak-password") {
                mensaje = "La contraseña es demasiado débil.";
            } else if (error.code === "auth/network-request-failed") {
                mensaje = "Revisa tu conexión a Internet.";
            } else if (error.code === "permission-denied") {
                mensaje = "Firestore no permite guardar los datos. Revisa las reglas de seguridad.";
            }

            Alert.alert("Error de registro", mensaje);
        } finally {
            setCargando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.contenedor}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido}>
                <Text style={styles.titulo}>Crear cuenta</Text>
                <Text style={styles.subtitulo}>
                    Regístrate para acceder a la tienda
                </Text>

                <Text style={styles.etiqueta}>Nombre completo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe tu nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    autoCapitalize="words"
                />

                <Text style={styles.etiqueta}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Text style={styles.etiqueta}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    value={contrasena}
                    onChangeText={setContrasena}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[
                        styles.boton,
                        cargando && styles.botonDeshabilitado,
                    ]}
                    onPress={registrarUsuario}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.textoBoton}>Registrarme</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonSecundario}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.textoSecundario}>
                        Ya tengo una cuenta. Iniciar sesión
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    contenido: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    titulo: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#7C7CFF",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 15,
        color: "#777777",
        textAlign: "center",
        marginBottom: 30,
    },
    etiqueta: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 7,
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 18,
        backgroundColor: "#FAFAFA",
    },
    boton: {
        backgroundColor: "#7C7CFF",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    botonDeshabilitado: {
        opacity: 0.6,
    },
    textoBoton: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    botonSecundario: {
        padding: 16,
        alignItems: "center",
    },
    textoSecundario: {
        color: "#5555CC",
        textAlign: "center",
    },
});
