import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeScreen } from '@/screens/main/home';
import { TabBarIcon } from '@/components/TabBarIcon';
import { ProfileScreen } from './main/profile';
import { UploadScreen } from './main/upload';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '@/components/common/button';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarActiveTintColor: '#2f95dc',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    height: 60,
                }
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="Upload" component={UploadScreen}
                options={{
                    title: 'Upload Image',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cloud-upload' : 'cloud-upload-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
