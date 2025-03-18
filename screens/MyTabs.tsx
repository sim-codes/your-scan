import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeScreen } from '@/screens/main/home';
import { EditorScreen } from '@/screens/main/file';
import { TabBarIcon } from '@/components/TabBarIcon';
import { ProfileScreen } from './main/profile';


const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            tabBarPosition='bottom'
            keyboardDismissMode='on-drag'
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarIndicator: () => null,
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
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
            {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
        </Tab.Navigator>
    );
}
