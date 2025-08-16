// pages/api/cloudinary-upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. 'mycloud'
  api_key: process.env.CLOUDINARY_API_KEY,       // from Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // from Cloudinary dashboard
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file } = req.body; // base64 string from frontend
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "profiles", // optional: puts images in /profiles folder in Cloudinary
    });

    return res.status(200).json({ secure_url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ error: error.message });
  }
}
