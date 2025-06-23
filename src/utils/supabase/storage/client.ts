import { createClient } from "../client";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};
export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
  const fileName = `${uuidv4()}.${fileExtension}`;
  const path = folder ? `${folder}/${fileName}` : fileName;

  try {
    file = await imageCompression(file, { maxSizeMB: 1 });
  } catch (error) {
    console.error(error);
    return { publicUrl: "", path: "", error: "Image compression failed" };
  }

  const storage = getStorage();
  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error || !data?.path) {
    return { publicUrl: "", path: "", error: error?.message || "Image upload failed" };
  }

  // Build the public URL for display
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;

  return { publicUrl, path: data.path, error: null };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};