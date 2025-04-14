import { useState } from 'react';
import { SafeAreaView } from '@/components/common/view';
import { Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { syncFilesWithFirebase } from '@/lib/syncFiles';
import { useUserStore } from '@/lib/authContext';
import { Props } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export const ProfileScreen = () => {
    const { user } = useUserStore();
    const [isSyncing, setIsSyncing] = useState(false);
    const navigation = useNavigation<Props['navigation']>();

    const handleSync = async () => {
        if (!user) {
            Toast.show({
                type: 'error',
                text1: 'Not logged in',
                text2: 'Please log in to sync files.',
            })
            return;
        }

        setIsSyncing(true);
        const success = await syncFilesWithFirebase(user.uid);
        setIsSyncing(false);

        if (success) {
            Toast.show({
                type: 'success',
                text1: 'Sync Successful',
                text2: 'Your files have been synchronized with the cloud.',
            })
        } else {

            Toast.show({
                type: 'error',
                text1: 'Sync Failed',
                text2: 'There was an error syncing your files. Please try again.',
            })
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white items-center justify-start p-4`}>
            <View style={tw`w-full max-w-md`}>
                {user ? (
                    <>
                        {/* User Info */}
                        <View style={tw`items-center mb-8 mt-4`}>
                            <View style={tw`w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-4`}>
                                <Feather name="user" size={48} color="#555" />
                            </View>
                            <Text style={tw`text-2xl font-bold text-gray-800`}>
                                {user?.displayName || 'User'}
                            </Text>
                            <Text style={tw`text-lg text-gray-500 mt-1`}>{user?.email || 'No email'}</Text>
                        </View>

                        {/* Sync Button */}
                        <Pressable
                            style={tw`w-full ${isSyncing ? 'opacity-50' : ''}`}
                            onPress={handleSync}
                            disabled={isSyncing}
                        >
                            <LinearGradient
                                colors={['#067ED3', '#0055B7']}
                                style={tw`px-4 py-3 rounded-md items-center justify-center h-14 flex-row`}
                            >
                                {isSyncing ? (
                                    <>
                                        <ActivityIndicator size="small" color="white" style={tw`mr-2`} />
                                        <Text style={tw`text-white text-lg font-bold`}>Syncing...</Text>
                                    </>
                                ) : (
                                    <>
                                        <Feather name="refresh-cw" size={20} color="white" style={tw`mr-2`} />
                                        <Text style={tw`text-white text-lg font-bold`}>Sync Files with Cloud</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={tw`text-lg text-gray-500 text-center mb-4`}>
                            You are not logged in. Please log in to sync your files with the cloud.
                        </Text>
                        <Pressable
                            style={tw`px-4 py-3 bg-blue-600 rounded-md items-center justify-center h-14`}
                            onPress={() => {
                                navigation.navigate('Login');
                            }}
                        >
                            <Text style={tw`text-white text-lg font-bold`}>Login</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};
