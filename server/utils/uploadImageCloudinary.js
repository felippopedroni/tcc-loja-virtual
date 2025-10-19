import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
    // Corrigindo o nome da função e aceitando a estrutura do Multer (image.buffer)
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'TCC',
            },
            (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }

                return resolve(uploadResult)
            }).end(buffer);
        

    });

    return uploadImage;
};

export default uploadImageCloudinary;