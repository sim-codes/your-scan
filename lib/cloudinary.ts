interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
}

class CloudinaryService {
    private cloudinaryUrl: string;
    private uploadPreset: string;

    constructor(cloudName: string, uploadPreset: string) {
        this.cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        this.uploadPreset = uploadPreset;
    }
    async uploadToCloudinary(localUri: string): Promise<string | null> {
        const formData = new FormData();
        formData.append('file', {
        uri: localUri,
        type: 'image/jpeg',
        name: 'upload.jpg'
        } as any);
        formData.append('upload_preset', this.uploadPreset);

        try {
            const response = await fetch(this.cloudinaryUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const responseJson = await response.json() as CloudinaryUploadResponse;
            return responseJson.secure_url;
        } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null;
        }
    }

    async handleImageUpload(imagrUri: string): Promise<string | null> {
        if (!imagrUri) return null;
        return this.uploadToCloudinary(imagrUri);
    }
}

const cloudinaryService = new CloudinaryService(
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
);

export default cloudinaryService;
