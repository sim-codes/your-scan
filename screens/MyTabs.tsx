import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeScreen } from '@/screens/main/home';
import { EditorScreen } from '@/screens/main/file';
import { TabBarIcon } from '@/components/TabBarIcon';
import { ProfileScreen } from './main/profile';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from '@/types/navigation';
import { UploadScreen } from './main/upload';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createMaterialTopTabNavigator();

const FleNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={HomeScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="File" component={EditorScreen}
                options={{
                    title: "My Files"
                }}
            />
        </Stack.Navigator>
    );
}

export default function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            tabBarPosition='bottom'
            keyboardDismissMode='on-drag'
        >
            <Tab.Screen name="Home" component={FleNavigation}
                options={{
                    tabBarIndicator: () => null,
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Upload" component={UploadScreen}
                options={{
                    tabBarIndicator: () => null,
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cloud-upload' : 'cloud-upload-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIndicator: () => null,
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
