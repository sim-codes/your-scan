import { $getRoot, $isElementNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

type ParagraphAlignment = 'left' | 'center' | 'right' | 'justify';

interface FormattedContent {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    alignment?: 'left' | 'center' | 'right' | 'justify';
    isNewParagraph?: boolean;
}

interface FormattedSegment {
    text: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

export const ExportPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const getFormattedContent = () => {
        const formatted: FormattedContent[] = [];

        const processNode = (node: any) => {
            if (node.getType() === 'text') {
                formatted.push({
                    text: node.getTextContent(),
                    bold: node.hasFormat('bold'),
                    italic: node.hasFormat('italic'),
                    underline: node.hasFormat('underline'),
                    strikethrough: node.hasFormat('strikethrough'),
                });
            } else if (node.getType() === 'paragraph') {
                // Add paragraph marker with alignment
                const format = node.getFormat();
                const alignment: ParagraphAlignment =
                    format === 1 ? 'left' :
                    format === 2 ? 'center' :
                    format === 3 ? 'right' :
                    format === 4 ? 'justify' :
                    'left';

                formatted.push({
                    text: '',
                    isNewParagraph: true,
                    alignment
                });
            }

            if ($isElementNode(node)) {
                const children = node.getChildren();
                children.forEach(processNode);
            }
        };

        const root = $getRoot();
        root.getChildren().forEach(processNode);

        return formatted;
    };
    
    const exportToPdf = () => {
        editor.update(() => {
            const fileName = promptFileName('document.pdf', '.pdf');
            if (!fileName) return;

            const formatted = getFormattedContent();
            const doc = new jsPDF();
            
            const margin = 20;
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const textWidth = pageWidth - (margin * 2);
            let y = margin;

            let currentParagraphSegments: FormattedSegment[] = [];
            let currentAlignment = 'left';

            const printParagraph = () => {
                if (currentParagraphSegments.length === 0) return;

                // Combine segments into lines that fit the page width
                let currentLine: FormattedSegment[] = [];
                const lines: FormattedSegment[][] = [];
                let currentLineWidth = 0;

                currentParagraphSegments.forEach(segment => {
                    // Set font temporarily to measure text
                    const fontStyle = (segment.bold && segment.italic) ? 'bolditalic'
                                    : segment.bold ? 'bold'
                                    : segment.italic ? 'italic'
                                    : 'normal';
                    doc.setFont('helvetica', fontStyle);
                    const segmentWidth = doc.getTextWidth(segment.text);

                    if (currentLineWidth + segmentWidth > textWidth) {
                        // Split segment if it's too long
                        const words = segment.text.split(' ');
                        let currentWords = '';
                        let remainingWords = '';

                        for (let i = 0; i < words.length; i++) {
                            const testWords = currentWords + (currentWords ? ' ' : '') + words[i];
                            const testWidth = doc.getTextWidth(testWords);

                            if (currentLineWidth + testWidth <= textWidth) {
                                currentWords = testWords;
                            } else {
                                remainingWords = words.slice(i).join(' ');
                                break;
                            }
                        }

                        if (currentWords) {
                            currentLine.push({ ...segment, text: currentWords });
                            lines.push(currentLine);
                        }

                        currentLine = [];
                        currentLineWidth = 0;

                        if (remainingWords) {
                            currentLine.push({ ...segment, text: remainingWords });
                            currentLineWidth = doc.getTextWidth(remainingWords);
                        }
                    } else {
                        currentLine.push(segment);
                        currentLineWidth += segmentWidth;
                    }
                });

                if (currentLine.length > 0) {
                    lines.push(currentLine);
                }

                // Print each line
                lines.forEach(line => {
                    // Check for page break
                    if (y > pageHeight - margin) {
                        doc.addPage();
                        y = margin;
                    }

                    // Calculate total line width
                    let lineWidth = 0;
                    line.forEach(segment => {
                        const fontStyle = (segment.bold && segment.italic) ? 'bolditalic'
                                        : segment.bold ? 'bold'
                                        : segment.italic ? 'italic'
                                        : 'normal';
                        doc.setFont('helvetica', fontStyle);
                        lineWidth += doc.getTextWidth(segment.text + ' ');
                    });

                    // Calculate starting x position based on alignment
                    let x = margin;
                    switch (currentAlignment) {
                        case 'center':
                            x = (pageWidth - lineWidth) / 2;
                            break;
                        case 'right':
                            x = pageWidth - margin - lineWidth;
                            break;
                        case 'justify':
                            if (line !== lines[lines.length - 1]) { // Don't justify last line
                                const spaces = line.length - 1;
                                const extraSpace = (textWidth - lineWidth) / spaces;
                                x = margin;

                                line.forEach((segment, index) => {
                                    const fontStyle = (segment.bold && segment.italic) ? 'bolditalic'
                                                    : segment.bold ? 'bold'
                                                    : segment.italic ? 'italic'
                                                    : 'normal';
                                    doc.setFont('helvetica', fontStyle);

                                    doc.text(segment.text, x, y);

                                    if (segment.underline) {
                                        const segWidth = doc.getTextWidth(segment.text);
                                        doc.line(x, y + 1, x + segWidth, y + 1);
                                    }

                                    if (segment.strikethrough) {
                                        const segWidth = doc.getTextWidth(segment.text);
                                        doc.line(x, y - 2, x + segWidth, y - 2);
                                    }

                                    x += doc.getTextWidth(segment.text) + (index < line.length - 1 ? extraSpace : 0);
                                });

                                y += 7;
                                return;
                            }
                            x = margin;
                            break;
                        default: // left
                            x = margin;
                    }

                    // Print each segment in the line
                    line.forEach(segment => {
                        const fontStyle = (segment.bold && segment.italic) ? 'bolditalic'
                                        : segment.bold ? 'bold'
                                        : segment.italic ? 'italic'
                                        : 'normal';
                        doc.setFont('helvetica', fontStyle);

                        const segmentWidth = doc.getTextWidth(segment.text);
                        doc.text(segment.text, x, y);

                        if (segment.underline) {
                            doc.line(x, y + 1, x + segmentWidth, y + 1);
                        }

                        if (segment.strikethrough) {
                            doc.line(x, y - 2, x + segmentWidth, y - 2);
                        }

                        x += segmentWidth + doc.getTextWidth(' ');
                    });

                    y += 7; // Line height
                });

                y += 3; // Paragraph spacing
            };

            formatted.forEach(item => {
                if (item.isNewParagraph) {
                    printParagraph();
                    currentParagraphSegments = [];
                    currentAlignment = item.alignment || 'left';
                } else {
                    currentParagraphSegments.push({
                        text: item.text,
                        bold: item.bold || false,
                        italic: item.italic || false,
                        underline: item.underline || false,
                        strikethrough: item.strikethrough || false
                    });
                }
            });

            // Print any remaining text
            printParagraph();

            doc.save(fileName);
        });
    };

    const exportToTxt = () => {
        editor.update(() => {
            const fileName = promptFileName('document.txt', '.txt');
            if (!fileName) return;

            const formatted = getFormattedContent();
            const textContent = formatted.map(item =>
                item.isNewParagraph ? '\n' : item.text
            ).join('');

            const blob = new Blob([textContent], { type: 'text/plain' });
            saveAs(blob, fileName);
        });
    };

    const exportToDocx = () => {
        editor.update(() => {
            const fileName = promptFileName('document.docx', '.docx');
            if (!fileName) return;

            const formatted = getFormattedContent();
            const paragraphs: Paragraph[] = [];
            let currentRuns: TextRun[] = [];
            let currentAlignment = AlignmentType.LEFT;

            formatted.forEach(item => {
                if (item.isNewParagraph) {
                    if (currentRuns.length > 0) {
                        paragraphs.push(new Paragraph({
                            children: currentRuns,
                            alignment: currentAlignment
                        }));
                        currentRuns = [];
                    }
                    currentAlignment =
                        item.alignment === 'center' ? AlignmentType.CENTER :
                        item.alignment === 'right' ? AlignmentType.RIGHT :
                        item.alignment === 'justify' ? AlignmentType.JUSTIFIED :
                        AlignmentType.LEFT;
                } else {
                    currentRuns.push(
                        new TextRun({
                            text: item.text,
                            bold: item.bold,
                            italics: item.italic,
                            underline: item.underline ? {} : undefined,
                            strike: item.strikethrough
                        })
                    );
                }
            });

            // Add remaining runs if any
            if (currentRuns.length > 0) {
                paragraphs.push(new Paragraph({
                    children: currentRuns,
                    alignment: currentAlignment
                }));
            }

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs
                }]
            });

            Packer.toBlob(doc).then(blob => {
                saveAs(blob, fileName);
            });
        });
    };

    const promptFileName = (defaultName: string, extension: string) => {
        const fileName = window.prompt('Enter file name:', defaultName);
        if (!fileName) return null;
        return fileName.endsWith(extension) ? fileName : `${fileName}${extension}`;
    };

    return (
        <div className="flex gap-2 mt-4">
            <button onClick={exportToTxt} className="toolbar-item spaced">Export as TXT</button>
            <button onClick={exportToPdf} className="toolbar-item spaced">Export as PDF</button>
            <button onClick={exportToDocx} className="toolbar-item">Export as DOCX</button>
        </div>
    );
};
