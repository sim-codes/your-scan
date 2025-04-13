import * as FileSystem from 'expo-file-system';
import { jsPDF } from 'jspdf';
import Toast from "react-native-toast-message";

export const htmlToPdf = async (htmlContent: string, fileName: string): Promise<string | null> => {
    try {
        // Create PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Remove HTML tags to get plain text (or you can use html2canvas for more complex rendering)
        // This is a simplified approach - for proper HTML rendering you'd need html2canvas or similar
        const plainText = htmlContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

        // Set font and add text to PDF
        doc.setFont('helvetica');
        doc.setFontSize(12);

        // Split text into multiple lines to fit on page
        const textLines = doc.splitTextToSize(plainText, 180); // 180mm width (A4 width with margins)
        doc.text(textLines, 15, 20); // Start at x=15mm, y=20mm

        // Create file path
        const pdfPath = `${FileSystem.documentDirectory}${fileName}`;

        // Convert PDF to base64 and save to file
        const pdfBase64 = doc.output('datauristring').split(',')[1]; // Remove data URI prefix
        await FileSystem.writeAsStringAsync(pdfPath, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });

        return pdfPath;
    } catch (error) {
        console.error('Error converting to PDF:', error);
        Toast.show({
            type: 'error',
            text1: 'PDF Export Failed',
            text2: 'Could not create PDF file'
        });
        return null;
    }
};
