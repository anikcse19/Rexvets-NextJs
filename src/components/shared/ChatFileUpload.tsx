"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Video, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatFileUploadProps {
  appointmentId: string;
  onFileUploaded: (fileUrl: string, fileName: string, messageType: string, fileSize?: number) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ChatFileUpload: React.FC<ChatFileUploadProps> = ({
  appointmentId,
  onFileUploaded,
  onError,
  disabled = false,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): "image" | "video" | "file" => {
    // Check MIME type first
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    
    // Fallback to file extension if MIME type is not available
    const fileName = file.name.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp'];
    
    for (const ext of imageExtensions) {
      if (fileName.endsWith(ext)) return 'image';
    }
    
    for (const ext of videoExtensions) {
      if (fileName.endsWith(ext)) return 'video';
    }
    
    return 'file';
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      video: 50 * 1024 * 1024, // 50MB
      file: 10 * 1024 * 1024, // 10MB
    };

    const allowedFormats = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'],
      video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', '3gp'],
      file: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z'],
    };

    const fileType = getFileType(file);
    const maxSize = maxSizes[fileType];
    const allowedFormatsList = allowedFormats[fileType];

    if (file.size > maxSize) {
      return { valid: false, error: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} file size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` };
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedFormatsList.includes(fileExtension)) {
      return { valid: false, error: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} format not allowed. Allowed formats: ${allowedFormatsList.join(', ')}` };
    }

    return { valid: true };
  };

  const uploadFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      onError?.(validation.error!);
      return;
    }

    const fileType = getFileType(file);

    const uploadingFile: UploadingFile = {
      file,
      progress: 0,
      status: 'uploading',
    };

    setUploadingFiles(prev => [...prev, uploadingFile]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('appointmentId', appointmentId);
      formData.append('messageType', fileType);

      const response = await fetch('/api/appointment-chat/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      // Update file status to success
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'success' as const, progress: 100 }
            : f
        )
      );

      // Call the callback with uploaded file info
      onFileUploaded(result.fileUrl, result.fileName, result.messageType, result.fileSize);

      // Remove from uploading files after a delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
      }, 2000);

    } catch (error) {
      console.error('❌ Upload error:', error);
      
      // Update file status to error
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'error' as const, error: (error as Error).message }
            : f
        )
      );

      onError?.((error as Error).message);
    }
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      uploadFile(file);
    });
  }, [appointmentId]);

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

  const getFileIcon = (file: File) => {
    const fileType = getFileType(file);
    switch (fileType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative">
      {/* File Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          Drag and drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Images (5MB), Videos (50MB), Documents (10MB)
        </p>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(uploadingFile.file)}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {uploadingFile.status === 'uploading' && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </>
                )}
                
                {uploadingFile.status === 'success' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">Success</span>
                  </>
                )}
                
                {uploadingFile.status === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600">Failed</span>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ChatFileUpload;
