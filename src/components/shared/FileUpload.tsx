"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, File, CheckCircle, AlertCircle } from 'lucide-react';
import { validateFile, formatFileSize, getFileIcon } from '@/lib/utils/fileValidation';
import imageCompression from 'browser-image-compression';

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  maxSize?: number;
  required?: boolean;
  multiple?: boolean;
  onFileChange: (files: File[], urls?: string[]) => void;
  onError?: (error: string) => void;
  preview?: boolean;
  className?: string;
  disabled?: boolean;
  vetName?: string; // Add vet name for filename prefixing
}

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  accept = "image/*,.pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB
  required = false,
  multiple = false,
  onFileChange,
  onError,
  preview = true,
  className = "",
  disabled = false,
  vetName,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create filename with vet name prefix for better Cloudinary recognition
  const createPrefixedFilename = useCallback((originalName: string): string => {
    if (!vetName) return originalName;
    
    // Clean the vet name (remove special characters, spaces to underscores)
    const cleanVetName = vetName
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .toLowerCase();
    
    // Get file extension
    const lastDotIndex = originalName.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';
    const nameWithoutExtension = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
    
    // Create timestamp for uniqueness
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Return prefixed filename: vetname_timestamp_originalname.extension
    return `${cleanVetName}_${timestamp}_${nameWithoutExtension}${extension}`;
  }, [vetName]);

  // Compress image if needed
  const compressImage = useCallback(async (file: File): Promise<File> => {
    console.log('Original file:', { name: file.name, size: file.size, type: file.type });
    
    if (file.type.startsWith('image/') && file.size > 1024 * 1024) { // Compress if > 1MB
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        
        console.log('Compressed file:', { 
          name: compressedFile.name, 
          size: compressedFile.size, 
          type: compressedFile.type,
          hasName: !!compressedFile.name,
          hasSize: typeof compressedFile.size === 'number'
        });
        
        // Ensure the compressed file has all the original properties
        if (compressedFile && compressedFile.name && typeof compressedFile.size === 'number') {
          return compressedFile;
        } else {
          console.warn('Compressed file is invalid, using original file');
          return file;
        }
      } catch (error) {
        console.warn('Image compression failed:', error);
        return file;
      }
    }
    return file;
  }, []);

  // Validate file
  const validateAndProcessFile = useCallback(async (file: File): Promise<FileWithPreview> => {
    // Parse accept prop to get allowed formats--
    const allowedFormats: string[] = [];
    const acceptTypes = accept.split(',').map(type => type.trim());
    
    acceptTypes.forEach(type => {
      if (type === 'image/*') {
        // Add all common image formats
        allowedFormats.push('jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg');
      } else if (type === 'application/pdf') {
        allowedFormats.push('pdf');
      } else if (type.includes('word') || type.includes('document')) {
        allowedFormats.push('doc', 'docx');
      } else if (type.startsWith('.')) {
        // Remove the dot and add the extension--
        allowedFormats.push(type.substring(1));
      } else {
        // Add the type as is
        allowedFormats.push(type);
      }
    });

    // Validate file
    const validation = validateFile(file, {
      max_bytes: maxSize,
      allowed_formats: allowedFormats
    });

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Compress image if needed
    const processedFile = await compressImage(file);

    // Use the processed file directly - filename prefixing will be handled during upload
    const renamedFile = processedFile;

    console.log('After compression:', { 
      name: renamedFile.name, 
      size: renamedFile.size, 
      type: renamedFile.type 
    });

    // Validate the renamed file
    if (!renamedFile || !renamedFile.name || typeof renamedFile.size !== 'number') {
      console.error('Renamed file validation failed:', renamedFile);
      throw new Error('File processing failed - invalid file object returned');
    }

    // Create preview for images
    let preview: string | undefined;
    if (renamedFile.type.startsWith('image/')) {
      preview = URL.createObjectURL(renamedFile);
    }



    // Add preview properties directly to the renamed file
    (renamedFile as FileWithPreview).preview = preview;
    (renamedFile as FileWithPreview).uploadStatus = 'pending';

    // Final validation of the complete object
    if (!renamedFile.name || typeof renamedFile.size !== 'number') {
      throw new Error('File processing failed - final validation failed');
    }

    return renamedFile as FileWithPreview;
  }, [accept, maxSize, compressImage, createPrefixedFilename]);

  // Get file icon safely
  const getFileIconSafely = useCallback((file: FileWithPreview) => {
    if (!file || !file.type) {
      return <File className="w-6 h-6" />;
    }
    
    const iconType = getFileIcon(file);
    switch (iconType) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'pdf':
        return <FileText className="w-6 h-6" />;
      case 'document':
        return <FileText className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setIsUploading(true);
    const newFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Validate file object
        if (!file || !file.name || typeof file.size !== 'number') {
          errors.push(`Invalid file object: ${file?.name || 'Unknown'}`);
          continue;
        }
        
        try {
          const processedFile = await validateAndProcessFile(file);

          // Ensure the processed file has all required properties
          if (!processedFile.name || typeof processedFile.size !== 'number') {
            errors.push(`${file.name}: File processing failed - invalid file object`);
            continue;
          }
          newFiles.push(processedFile);
        } catch (error) {
          errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Invalid file'}`);
        }
      }

      if (errors.length > 0) {
        errors.forEach(error => onError?.(error));
      }

      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);
        onFileChange(updatedFiles);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to process files');
    } finally {
      setIsUploading(false);
    }
  }, [files, multiple, validateAndProcessFile, onFileChange, onError]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Remove file
  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  }, [files, onFileChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* File Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              handleFileSelect(files);
            }
            // Reset the input value to allow selecting the same file again
            e.target.value = '';
          }}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <p className="font-medium">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.includes('image/*') ? 'Images, PDFs, and documents' : 'Files'} up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Processing files...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Previews */}
      {preview && files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    {getFileIconSafely(file)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name || 'Unknown file'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {file.uploadStatus === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {file.uploadStatus === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  disabled={disabled}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {files.some(file => file.error) && (
        <div className="text-sm text-red-600">
          {files.map((file, index) => 
            file.error && (
              <p key={index} className="flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{file.name}: {file.error}</span>
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
