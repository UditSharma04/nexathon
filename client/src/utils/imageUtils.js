export const processImage = (imageUrl, maxWidth = 800) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";  // Handle CORS
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#242424'; // Dark background
      ctx.fillRect(0, 0, width, height);
      
      // Calculate dimensions to maintain aspect ratio
      const aspectRatio = img.width / img.height;
      let drawWidth = width;
      let drawHeight = height;
      
      if (aspectRatio > 4/3) { // Wider than target
        drawWidth = height * aspectRatio;
        drawHeight = height;
      } else { // Taller than target
        drawWidth = width;
        drawHeight = width / aspectRatio;
      }
      
      // Center the image
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      // Convert to WebP with compression
      canvas.toBlob(
        (blob) => {
          resolve(URL.createObjectURL(blob));
        },
        'image/webp',
        0.85 // Compression quality
      );
    };
    
    img.onerror = () => {
      resolve(imageUrl); // Fallback to original URL if processing fails
    };
    
    img.src = imageUrl;
  });
}; 