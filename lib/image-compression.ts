interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    maxSizeBytes?: number;
    quality?: number; // 0 to 1
    format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        maxSizeBytes = 2 * 1024 * 1024, // Default 2MB (larger default, but specific calls can override)
        quality = 0.8,
        format = 'image/webp'
    } = options;

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
            let width = image.width;
            let height = image.height;

            // Calculate new dimensions respecting aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Use high quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(image, 0, 0, width, height);

            // Compression Loop
            let currentQuality = quality;

            const tryCompress = (q: number) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Compression failed"));
                        return;
                    }

                    // Check if satisfied:
                    // 1. Size is under limit OR
                    // 2. We hit minimum quality (0.5 to avoid blurry mess)
                    if (blob.size <= maxSizeBytes || q <= 0.5) {
                        const fileExt = format === 'image/webp' ? '.webp' : (format === 'image/png' ? '.png' : '.jpg');
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + fileExt, {
                            type: format,
                            lastModified: Date.now()
                        });
                        resolve(newFile);
                    } else {
                        // Reduce quality and try again
                        tryCompress(q - 0.1);
                    }
                }, format, q);
            };

            tryCompress(currentQuality);
        };

        image.onerror = (err) => {
            reject(err);
        };
    });
}
