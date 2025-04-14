import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { FileTypes, FILES_INDEX_KEY, STORAGE_KEY_PREFIX } from '@/types/file';
import { db } from '@/FirebaseConfig';
import MMKVStorage from 'react-native-mmkv-storage';

const storage = new MMKVStorage.Loader().initialize();

export const syncFilesWithFirebase = async (userId: string): Promise<boolean> => {
    try {
        const filesCollection = collection(db, `users/${userId}/files`);

        // Get local files
        const localFilesIndexStr = await storage.getStringAsync(FILES_INDEX_KEY);
        let localFiles: FileTypes[] = localFilesIndexStr ? JSON.parse(localFilesIndexStr) : [];

        // Get remote files
        const remoteFilesSnapshot = await getDocs(filesCollection);
        const remoteFilesMap: { [id: string]: FileTypes } = {};
        remoteFilesSnapshot.forEach((doc) => {
            const data = doc.data() as FileTypes;
            remoteFilesMap[doc.id] = { ...data, id: doc.id };
        });

        // Sync local to remote
        for (const localFile of localFiles) {
            const content = await storage.getStringAsync(STORAGE_KEY_PREFIX + localFile.id);
            const remoteFile = remoteFilesMap[localFile.id];

            if (!remoteFile) {
                // New local file, upload to Firebase
                await setDoc(doc(filesCollection, localFile.id), {
                    ...localFile,
                    content,
                });
            } else {
                // Compare lastModified
                const localModified = new Date(localFile.lastModified).getTime();
                const remoteModified = new Date(remoteFile.lastModified).getTime();
                if (localModified > remoteModified) {
                    // Local is newer, update remote
                    await setDoc(doc(filesCollection, localFile.id), {
                        ...localFile,
                        content,
                    });
                }
            }
        }

        // Sync remote to local
        for (const remoteFile of Object.values(remoteFilesMap)) {
            const localFile = localFiles.find((f) => f.id === remoteFile.id);
            if (!localFile) {
                // New remote file, add to local
                localFiles.push({ ...remoteFile, content: '' });
                await storage.setStringAsync(STORAGE_KEY_PREFIX + remoteFile.id, remoteFile.content);
            } else {
                // Compare lastModified
                const localModified = new Date(localFile.lastModified).getTime();
                const remoteModified = new Date(remoteFile.lastModified).getTime();
                if (remoteModified > localModified) {
                    // Remote is newer, update local
                    localFiles = localFiles.map((f) =>
                        f.id === remoteFile.id ? { ...remoteFile, content: '' } : f
                    );
                    await storage.setStringAsync(STORAGE_KEY_PREFIX + remoteFile.id, remoteFile.content);
                }
            }
        }

        // Update local index
        await storage.setStringAsync(FILES_INDEX_KEY, JSON.stringify(localFiles));
        return true;
    } catch (error) {
        console.error('Error syncing files:', error);
        return false;
    }
};
