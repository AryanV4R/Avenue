const key = (userId: string) => `linkbio:avatar:${userId}`;

export function getSavedAvatar(userId: string): string {
  try {
    return localStorage.getItem(key(userId)) ?? "";
  } catch {
    return "";
  }
}

export function saveAvatar(userId: string, dataUrl: string) {
  try {
    localStorage.setItem(key(userId), dataUrl);
  } catch {}
}

export function resizeAvatar(dataUrl: string, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas
        .getContext("2d")!
        .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = dataUrl;
  });
}