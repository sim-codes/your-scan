import * as FileSystem from 'expo-file-system';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Toast from "react-native-toast-message";

export const htmlToDocx = async (htmlContent: string, fileName: string): Promise<string | null> => {
    try {
        // Create a new document
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(htmlContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim())
                        ]
                    })
                ]
            }]
        });

        // Create the file path
        const docxPath = `${FileSystem.documentDirectory}${fileName}`;

        // Generate the docx file as a buffer
        const buffer = await Packer.toBuffer(doc);

        // Convert buffer to base64 string
        const base64 = Buffer.from(buffer).toString('base64');

        // Write the base64 string to a file
        await FileSystem.writeAsStringAsync(docxPath, base64, { encoding: FileSystem.EncodingType.Base64 });

        return docxPath;
    } catch (error) {
        console.error('Error converting to DOCX:', error);
        Toast.show({
            type: 'error',
            text1: 'DOCX Export Failed',
            text2: 'Could not create DOCX file'
        });
        return null;
    }
};
