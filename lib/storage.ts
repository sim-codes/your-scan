import MMKVStorage from 'react-native-mmkv-storage';
import { FileTypes, FILES_INDEX_KEY, STORAGE_KEY_PREFIX } from '@/types/file';

const storage = new MMKVStorage.Loader().initialize();


export const FileStorage = {
  /**
   * Save or update a file
   */
  saveFile: async (fileId: string | null, content: string, fileName?: string): Promise<FileTypes> => {
    try {
      let newFileId = fileId || Date.now().toString();
      let newFileName = fileName || 'New Document';
      
      // Retrieve existing files index
      const filesIndexStr = await storage.getStringAsync(FILES_INDEX_KEY);
      let files: FileTypes[] = filesIndexStr ? JSON.parse(filesIndexStr) : [];

      if (fileId) {
        // Update existing file
        files = files.map(file =>
          file.id === fileId ? { ...file, lastModified: new Date().toISOString() } : file
        );
      } else {
        // Create new file entry
        const newFile: FileTypes = {
          id: newFileId,
          name: newFileName,
          date: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          content: ''
        };
        files.push(newFile);
      }

      // Store file content separately
      await storage.setStringAsync(STORAGE_KEY_PREFIX + newFileId, content);
      // Update file index
      await storage.setStringAsync(FILES_INDEX_KEY, JSON.stringify(files));

      return { id: newFileId, name: newFileName, date: new Date().toISOString(), content, lastModified: new Date().toISOString() };
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },

  /**
   * Get a file's content by ID
   */
  getFile: async (fileId: string): Promise<FileTypes | null> => {
    try {
      const content = await storage.getStringAsync(STORAGE_KEY_PREFIX + fileId);
      if (!content) return null;

      const filesIndexStr = await storage.getStringAsync(FILES_INDEX_KEY);
      const files: FileTypes[] = filesIndexStr ? JSON.parse(filesIndexStr) : [];
      const fileMeta = files.find(file => file.id === fileId);
      
      return fileMeta ? { ...fileMeta, content } : null;
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  },

  /**
   * Get all files metadata (without content)
   */
  getAllFiles: async (): Promise<FileTypes[]> => {
    try {
      const filesIndexStr = await storage.getStringAsync(FILES_INDEX_KEY);
      return filesIndexStr ? JSON.parse(filesIndexStr) : [];
    } catch (error) {
      console.error('Error getting all files:', error);
      return [];
    }
  },

  /**
   * Delete a file
   */
  deleteFile: async (fileId: string): Promise<boolean> => {
    try {
      // Remove file content
      await storage.removeItem(STORAGE_KEY_PREFIX + fileId);

      // Remove from index
      const filesIndexStr = await storage.getStringAsync(FILES_INDEX_KEY);
      if (filesIndexStr) {
        let files: FileTypes[] = JSON.parse(filesIndexStr);
        files = files.filter(file => file.id !== fileId);
        await storage.setStringAsync(FILES_INDEX_KEY, JSON.stringify(files));
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  },

  /**
   * Rename a file
   */
  renameFile: async (fileId: string, newName: string): Promise<boolean> => {
    try {
      const filesIndexStr = await storage.getStringAsync(FILES_INDEX_KEY);
      if (!filesIndexStr) return false;

      let files: FileTypes[] = JSON.parse(filesIndexStr);
      files = files.map(file =>
        file.id === fileId
          ? { ...file, name: newName, lastModified: new Date().toISOString() }
          : file
      );

      await storage.setStringAsync(FILES_INDEX_KEY, JSON.stringify(files));
      return true;
    } catch (error) {
      console.error('Error renaming file:', error);
      return false;
    }
  },

  /**
   * Clear all stored files (Dangerous)
   */
  clearAllFiles: async (): Promise<void> => {
    await storage.clearStore();
  }
};
