import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {router} from "expo-router";
import {BASE_URL} from "@/constants/constants";
import {useSQLiteContext} from "expo-sqlite";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const database = useSQLiteContext()
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
                console.log(userData)
                router.replace('/')
            }
        };
        loadUserData().catch(console.error);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post(BASE_URL + 'login', {
                email,
                password
            });

            if (response.status === 200 && response.data) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                const statement = await database.prepareAsync(`INSERT OR REPLACE INTO users (user_id, username) VALUES (?, ?)`)
                await statement.executeAsync(response.data.user_id, response.data.username)
                router.push('/');
            } else {
                setError('Login failed');
            }
        } catch (err) {
            console.error(err)
            setError('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, username: string, password: string) => {
        try {
            setIsLoading(true);
            console.log(email, username, password)
            const response = await axios.post(BASE_URL + 'register', {
                email: email,
                username: username,
                password: password
            })

            console.log(response.data)

            if (response.status === 201 && response.data) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                const statement = await database.prepareAsync(`INSERT OR REPLACE INTO users (user_id, username) VALUES (?, ?)`)
                await statement.executeAsync(response.data.user_id, response.data.username)
                router.replace('/');
            } else {
                setError('Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.clear();
            setUser(null)
            router.replace('/login')
        } catch (err) {
            console.error(err);
            setError('Logout failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider
