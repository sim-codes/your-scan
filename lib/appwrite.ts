import { Client, Databases, Account } from "react-native-appwrite";

const client = new Client();
client
    .setEndpoint(process.env.EXPO_PPUBLIC_APP_WRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APP_WRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PPUBLIC_APP_WRITE_PLATFORM!);


export const account = new Account(client);
export const databases = new Databases(client);