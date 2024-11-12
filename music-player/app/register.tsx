import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {defaultStyle} from "@/constants/styles";
import {useAuthContext} from "@/context/AuthContext";
import {router} from "expo-router";
import {Image} from "expo-image";
import imageLogo from "@/assets/images/favicon.png"
import imageText from "@/assets/images/text.png"

const RegisterScreen = () => {
    const inset = useSafeAreaInsets()
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { register } = useAuthContext()

    return (
        <View style={{...styles.container, paddingTop: inset.top}}>
            <Image source={imageLogo} style={styles.imageLogo} contentFit={"contain"} />
            <Image source={imageText} style={styles.imageText} contentFit={"contain"} />
            <TextInput
                style={styles.input}
                placeholder={'Username'}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder={'Email'}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder={'Password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <Pressable style={styles.button} onPress={() => register(email, username, password)}>
                <Text style={{...defaultStyle.title, color: 'white', textAlign: 'center'}}>Register</Text>
            </Pressable>
            <View style={styles.buttonText} >
                <Text style={defaultStyle.title}>Đã có tài khoản?</Text>
                <Pressable onPress={() => router.replace('/login')}>
                    <Text style={{...defaultStyle.title, color: '#8B5DFF'}}>Login</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...defaultStyle.container,
        alignItems: "center",
        justifyContent: "center"
    },
    imageLogo: {
        width: 100,
        height: 100,
        marginBottom: 10
    },
    imageText: {
        width: 200,
        height: 50,
        marginBottom: 30
    },
    input: {
        width: '100%',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    button: {
        width: '100%',
        backgroundColor: '#8B5DFF',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    buttonText: {
        flexDirection: "row",
        gap: 10
    }
})

export default RegisterScreen;