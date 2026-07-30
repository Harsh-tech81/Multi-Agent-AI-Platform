import {S3} from "../config/S3.js";
import {PutObjectCommand} from "@aws-sdk/client-s3";
export const uploadToS3=async (fileName, buffer, contentType)=>{

await S3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType
}));
return fileName;
}