import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3} from "../config/S3.js";
import {GetObjectCommand} from "@aws-sdk/client-s3";

export const getFromS3=async (fileName,expiresIn=600)=>{
return await getSignedUrl(S3, new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName
}), { expiresIn });
}

