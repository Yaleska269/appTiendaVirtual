import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function LoginScreen({ navigation }) {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async () => {
        if (!correo.trim() || !contrasena) {
            Alert.alert(
                "Campos obligatorios",
                "Ingresa tu correo y contraseña."
            );
            return;
        }

        try {
            setCargando(true);

            const credencial = await signInWithEmailAndPassword(
                auth,
                correo.trim(),
                contrasena
            );

            const usuario = credencial.user;
            const referencia = doc(db, "Usuarios", usuario.uid);
            const resultado = await getDoc(referencia);

            if (!resultado.exists()) {
                await signOut(auth);
                Alert.alert(
                    "Perfil no encontrado",
                    "Tu cuenta no tiene un perfil registrado en Firestore."
                );
                return;
            }

            const datos = resultado.data();

            if (datos.rol === "admin") {
                navigation.replace("Admin");
            } else if (datos.rol === "cliente") {
                navigation.replace("Cliente");
            } else {
                await signOut(auth);
                Alert.alert(
                    "Rol inválido",
                    "El rol del usuario no está configurado correctamente."
                );
            }
        } catch (error) {
            console.log(
                "Error al iniciar sesión:",
                error.code,
                error.message
            );

            let mensaje = "No se pudo iniciar sesión.";

            if (error.code === "auth/invalid-credential") {
                mensaje = "El correo o la contraseña son incorrectos.";
            } else if (error.code === "auth/invalid-email") {
                mensaje = "El correo electrónico no es válido.";
            } else if (error.code === "auth/network-request-failed") {
                mensaje = "Revisa tu conexión a Internet.";
            } else if (
                error.code === "permission-denied" ||
                error.code === "firestore/permission-denied"
            ) {
                mensaje = "No tienes permiso para consultar tu perfil.";
            }

            Alert.alert("Inicio de sesión", mensaje);
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Tienda Virtual</Text>
            <Text style={styles.subtitulo}>
                Inicia sesión para continuar
            </Text>

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
                placeholder="Ingresa tu contraseña"
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
                onPress={iniciarSesion}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.textoBoton}>
                        Iniciar sesión
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.botonSecundario}
                onPress={() => navigation.navigate("Registro")}
            >
                <Text style={styles.textoSecundario}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
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
    botonSecundario: {
        padding: 16,
        alignItems: "center",
    },
    textoBoton: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    textoSecundario: {
        color: "#5555CC",
        textAlign: "center",
    },
});
