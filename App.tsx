import './gesture-handler';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyTabs from "./screens/MyTabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from '@/types/navigation';
import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/register';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
    const isAuthenticated = true;
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {isAuthenticated ? (
                    <>
                        <MyTabs />
                    </>
                ) : (
                        <Stack.Navigator>
                            <Stack.Screen name='Login' component={LoginScreen} options={{
                                headerShown: false
                            }} />
                            <Stack.Screen name='Register' component={RegisterScreen} options={{
                                headerShown: false
                            }} />
                        </Stack.Navigator>
                )}
            </NavigationContainer >
        </SafeAreaProvider>
    );
}
