import {Tabs} from "expo-router";
import React from "react";
import {Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const TabsLayout = () => {
    const inset = useSafeAreaInsets()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            sceneContainerStyle={{paddingTop: inset.top}}
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
                    title: "Your Library",
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
