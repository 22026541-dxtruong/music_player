import {Redirect, Tabs} from "expo-router";
import React from "react";
import {Ionicons} from "@expo/vector-icons";
import {useAuthContext} from "@/context/AuthContext";

const TabsLayout = () => {

    const { user } = useAuthContext()

    if (!user) {
        return <Redirect href={'/login'} />
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name="home" size={24} color={focused ? color : "gray"}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons
                            name="search-sharp"
                            size={24}
                            color={focused ? color : "gray"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: "Library",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons
                            name="library"
                            size={24}
                            color={focused ? color : "gray"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
