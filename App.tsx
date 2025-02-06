import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/auth/login";
import RegisterScreen from "./screens/auth/register";
import MainScreen from "./screens/main/home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SavedFilesScreen } from "./screens/main/files";

export type RootStackParamList = {
    Home: { fileId: string, fileName: string, content: string };
    File: undefined;
    Login?: undefined;
    Register?: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
    const isAuthenticated = true;
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    {isAuthenticated ? (
                        <>
                            <Stack.Screen name="Home" component={MainScreen} />
                            <Stack.Screen name="File" component={SavedFilesScreen}
                            />
                        </>
                    ) : (
                            <>
                                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                            </>
                    )}
                </Stack.Navigator>
            </NavigationContainer >
        </SafeAreaProvider>
    );
}
