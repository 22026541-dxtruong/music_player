import React from 'react';
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {StyleSheet, Text, View} from "react-native";
import CircleAvatar from "@/components/CircleAvatar";
import {useAuthContext} from "@/context/AuthContext";
import {defaultStyle} from "@/constants/styles";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from "@/constants/colors";
import {router} from "expo-router";

const DrawerContent = () => {
    const { user, logout } = useAuthContext()

    return (
        <DrawerContentScrollView >
            <View style={styles.header}>
                <CircleAvatar size={100} />
                <Text style={defaultStyle.title}>{user?.username}</Text>
            </View>
            <DrawerItem
                icon={({size, color}) => <MaterialIcons name="download-done" size={size} color={color} />}
                label={'Đã tải xuống'}
                onPress={() => router.push('/(drawer)/downloaded')}
            />
            <DrawerItem
                icon={({size, color}) => <MaterialIcons name="history" size={size} color={color} />}
                label={'Xem lịch sử'}
                onPress={() => null}
            />
            <DrawerItem
                icon={({size, color}) => <MaterialIcons name="password" size={size} color={color} />}
                label={'Đổi mật khẩu'}
                onPress={() => null}
            />
            <DrawerItem
                icon={({size}) => <MaterialIcons name="delete" size={size} color={'red'} />}
                label={() => <Text style={{color: colors.error}}>Xóa tài khoản</Text>}
                onPress={() => null}
            />
            <DrawerItem
                icon={({size, color}) => <MaterialIcons name="logout" size={size} color={color} />}
                label={'Đăng xuất'}
                onPress={() => logout()}
            />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
})

export default DrawerContent;