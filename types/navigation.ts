import type { StackScreenProps } from '@react-navigation/stack';

export type Params = { fileId: string, fileName: string, content: string }

export type RootStackParamList = {
    Main: undefined;
    File: Params;
    Login?: undefined;
    Register?: undefined;
    Camera?: undefined;
    UploadStart?: undefined;
    Tabs: undefined;
    Home: { screen: string, params: Params };
    Editor: Params;
};

export type Props = StackScreenProps<RootStackParamList, 'File'>;
