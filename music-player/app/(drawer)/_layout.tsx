import React from 'react';
import {Drawer} from "expo-router/drawer";
import DrawerContent from "@/components/DrawerContent";

const DrawerLayout = () => {
    return (
        <Drawer
            screenOptions={{headerShown: false}}
            drawerContent={() => <DrawerContent/>}
        >
            <Drawer.Screen name={'(tabs)'}/>
            <Drawer.Screen name={'downloaded'} options={{
                headerShown: true,
                title: "Đã tải xuống"
            }}/>
        </Drawer>
    );
};

export default DrawerLayout;