import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Categoria from "../components/Categoria";
import Producto from "../components/Producto";

const Catalogo = () => {
    return (
        <ScrollView style={styles.contenedor}>

            <View style={styles.buscador}>
                <Ionicons
                    name="search-outline"
                    size={18}
                    color="#7C7CFF"
                />

                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#B5B5D5"
                    style={styles.input}
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

            <Text style={styles.titulo}>News</Text>

            <View style={styles.productos}>

                <Producto
                    nombre="A Room of One's Own"
                    precio="12"
                    tiempo="4 hours ago"
                    color="#78B8D8"
                    imagen="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
                />

                <Producto
                    nombre="Wireless headphones"
                    precio="50"
                    tiempo="8 hours ago"
                    color="#ABE865"
                    imagen="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                />

                <Producto
                    nombre="White sneakers"
                    precio="27"
                    tiempo="10 hours ago"
                    color="#F5AFC1"
                    imagen="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
                />

                <Producto
                    nombre="Smartphone"
                    precio="300"
                    tiempo="12 hours ago"
                    color="#D8C4F1"
                    imagen="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
                />

                <Producto
                    nombre="Laptop"
                    precio="650"
                    tiempo="1 day ago"
                    color="#A8D8EA"
                    imagen="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
                />

                <Producto
                    nombre="Watch"
                    precio="80"
                    tiempo="1 day ago"
                    color="#F5D6A6"
                    imagen="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                />

            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#FFFFFF",
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
    },

    categorias: {
        marginBottom: 10,
    },

    linea: {
        height: 3,
        backgroundColor: "#AAAAAA",
        marginHorizontal: -10,
    },

    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222",
        marginTop: 15,
        marginBottom: 10,
    },

    productos: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 20,
    },
});

export default Catalogo;