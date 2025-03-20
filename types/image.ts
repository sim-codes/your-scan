export interface ImageDetailsType {
    name: string;
    size: number;
    type: string;
    uri: string;
}

export interface ImageToTextResponse {
    all_text: string;
    annonations: string[];
    lang: string;
}
