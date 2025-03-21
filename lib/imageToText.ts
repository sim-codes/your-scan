import { API_KEY } from "@/constants";
import { Alert } from "react-native";
import { ImageToTextResponse } from "@/types/image";
import cloudinaryService from "./cloudinary";


export const getTextFromImage = async (imagePath: string) => {
    const imageUrl = await cloudinaryService.handleImageUpload(imagePath);
    if (!imageUrl) {
        Alert.alert("Error", "Failed to upload image. Please try again.");
        return;
    }
    const response = await fetch(`https://api.apilayer.com/image_to_text/url?url=${imageUrl}`, {
        method: 'GET',
        headers: {
            'apikey': API_KEY,
        }
    });
    return await response.json() as ImageToTextResponse;
}
