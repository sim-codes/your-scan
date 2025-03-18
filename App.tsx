import './gesture-handler';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyTabs from "./screens/MyTabs";


export default function App() {
    const isAuthenticated = true;
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <MyTabs />
            </NavigationContainer >
        </SafeAreaProvider>
    );
}
