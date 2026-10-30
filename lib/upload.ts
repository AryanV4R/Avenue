import { supabase } from "@/lib/supabase";

function toBlob(file: File, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const c = document.createElement("canvas");
      c.width = c.height = size;
      c.getContext("2d")!.drawImage(
        img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size
      );
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("fail"))), "image/jpeg", 0.85);
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = url;
  });
}

export async function uploadImage(userId: string, name: string, file: File, size: number) {
  const path = `${userId}/${name}.jpg`;
  const blob = await toBlob(file, size);
  const { error } = await supabase.storage
    .from("media")
    .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`; // cache bust
}

export async function removeImage(userId: string, name: string) {
  await supabase.storage.from("media").remove([`${userId}/${name}.jpg`]);
}