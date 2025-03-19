import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
    Main: undefined;
    File: { fileId: string, fileName: string, content: string };
    Login?: undefined;
    Register?: undefined;
    Camera?: undefined;
    UploadStart?: undefined;
};

export type Props = StackScreenProps<RootStackParamList, 'File'>;
