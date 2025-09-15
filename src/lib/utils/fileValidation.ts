// Client-side safe file validation utilities

export interface FileValidationOptions {
  allowed_formats?: string[];
  max_bytes?: number;
}

// Default validation options
const defaultOptions: FileValidationOptions = {
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
  max_bytes: 10 * 1024 * 1024, // 10MB
};

// Validate file (client-side safe)
export const validateFile = (file: File, options: FileValidationOptions = {}): { valid: boolean; error?: string } => {
  const { allowed_formats = defaultOptions.allowed_formats, max_bytes = defaultOptions.max_bytes } = options;
  
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

// Format file size for display
export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes < 0) {
    return 'Unknown size';
  }
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on type
export const getFileIcon = (file: File): string => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.includes('word') || file.type.includes('document')) return 'document';
  return 'file';
};

// Check if file is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// Check if file is a document
export const isDocumentFile = (file: File): boolean => {
  return file.type === 'application/pdf' || 
         file.type.includes('word') || 
         file.type.includes('document');
};
