import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary environment variables are set
const requiredEnvVars = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing Cloudinary environment variables:', missingVars);
  throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
}

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  pages?: number; // For PDFs
}

export interface UploadOptions {
  folder?: string;
  transformation?: any;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  allowed_formats?: string[];
  max_bytes?: number;
  public_id?: string; // Custom filename for Cloudinary
  access_mode?: 'public' | 'authenticated'; // Access mode for the uploaded file
  delivery_type?: 'upload' | 'private' | 'authenticated'; // Delivery type
  type?: 'upload' | 'private' | 'authenticated'; // Upload type
  unsigned?: boolean; // Force unsigned upload
}

// Default upload options
const defaultOptions: UploadOptions = {
  folder: 'rexvets',
  resource_type: 'auto',
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
  max_bytes: 10 * 1024 * 1024, // 10MB
};

// Validate file before upload (client-side safe)
export const validateFile = (file: File, options: UploadOptions = {}): { valid: boolean; error?: string } => {
  // Use provided options or defaults, but prioritize provided options
  const allowed_formats = options.allowed_formats || defaultOptions.allowed_formats;
  const max_bytes = options.max_bytes || defaultOptions.max_bytes;
  
  // Check file size
  if (file.size > max_bytes!) {
    return { valid: false, error: `File size must be less than ${Math.round(max_bytes! / 1024 / 1024)}MB` };
  }
  
  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowed_formats!.includes(fileExtension)) {
    return { valid: false, error: `File format not allowed. Allowed formats: ${allowed_formats!.join(', ')}` };
  }
  
  return { valid: true };
};

// Upload file to Cloudinary (server-side only)
export const uploadToCloudinary = async (
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const uploadOptions = { ...defaultOptions, ...options };
  
  // Validate file if it's a File object
  if (file instanceof File) {
    const validation = validateFile(file, options);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }
  
  try {
    // Convert file to base64 if it's a File object
    let fileData: string;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fileData = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      fileData = file.toString('base64');
    }
    
    // Upload to Cloudinary
    const uploadParams: any = {
      folder: uploadOptions.folder,
      resource_type: uploadOptions.resource_type,
      transformation: uploadOptions.transformation,
      public_id: uploadOptions.public_id, // Use custom filename if provided
    };

    // Add parameters for signed uploads (default case)
    if (!uploadOptions.unsigned) {
      uploadParams.use_filename = !uploadOptions.public_id;
      uploadParams.unique_filename = !uploadOptions.public_id;
      uploadParams.overwrite = false;
      uploadParams.access_mode = uploadOptions.access_mode;
      uploadParams.delivery_type = uploadOptions.delivery_type;
      uploadParams.type = uploadOptions.type;
    }

    // Add unsigned parameter if specified
    if (uploadOptions.unsigned) {
      uploadParams.unsigned = true;
    }

    const result = await cloudinary.uploader.upload(fileData, uploadParams);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      pages: result.pages,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete file from Cloudinary (server-side only)
export const deleteFromCloudinary = async (public_id: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

// Generate optimized image URL (server-side only)
export const getOptimizedImageUrl = (public_id: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
} = {}): string => {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  let transformation = `f_${format},q_${quality}`;
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  
  return cloudinary.url(public_id, {
    transformation: transformation,
    secure: true,
  });
};

// Generate PDF thumbnail (server-side only)
export const getPdfThumbnail = (public_id: string, page: number = 1): string => {
  return cloudinary.url(public_id, {
    transformation: `pg_${page},f_png,w_300,h_400,c_fill`,
    secure: true,
  });
};

export default cloudinary;
