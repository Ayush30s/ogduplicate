import { useState } from 'react';

const useUploadToCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  // Cloudinary configuration
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dptb2ltol/image/upload'; // Your Cloudinary Cloud name
  const uploadPreset = 'YOUR_UPLOAD_PRESET';  // Unsigned upload preset from Cloudinary

  // Function to upload the image to Cloudinary
  const uploadImage = async (file) => {
    setUploading(true);  // Set loading state to true while the image uploads
    setError(null);

    const formData = new FormData();
    formData.append('file', file);  // Append the file to the formData
    formData.append('upload_preset', uploadPreset);  // Append the preset

    try {
      // Upload to Cloudinary
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      // Parse the response
      const data = await response.json();

      if (data.secure_url) {
        // Set the URL of the uploaded image
        setImageUrl(data.secure_url);
      } else {
        setError('Error uploading image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image');
    } finally {
      setUploading(false);  // Reset the loading state
    }
  };

  return { uploadImage, uploading, imageUrl, error };
};

export default useUploadToCloudinary;
