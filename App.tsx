import './gesture-handler';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyTabs from "./screens/MyTabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from '@/types/navigation';
import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/register';
import { CameraScreen } from './screens/main/camera';
import { TextEditorScreen } from './screens/main/editor';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { initializeAuth, useUserStore } from '@/lib/context';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
    useEffect(() => {
        initializeAuth();
    }, []);

    const { user } = useUserStore();

    const isAuthenticated = true;

    return (
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name='Tabs' component={MyTabs} options={{
                            headerShown: false
                        }} />
                        <Stack.Screen name='Editor' component={TextEditorScreen} options={{
                            headerShown: false
                        }} />
                        <Stack.Screen name='Camera' component={CameraScreen} options={{
                            headerShown: false
                        }}
                        />
                        <Stack.Screen name='Login' component={LoginScreen} options={{
                            headerShown: false
                        }} />
                        <Stack.Screen name='Register' component={RegisterScreen} options={{
                            headerShown: false
                        }} />
                    </Stack.Navigator>
                </NavigationContainer >
                <Toast />
            </SafeAreaProvider>
    );
}
