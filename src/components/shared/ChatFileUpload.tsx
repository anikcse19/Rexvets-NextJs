"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Video, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatFileUploadProps {
  appointmentId: string;
  onFileUploaded: (fileUrl: string, fileName: string, messageType: string) => void;
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
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      video: 50 * 1024 * 1024, // 50MB
      file: 10 * 1024 * 1024, // 10MB
    };

    const allowedFormats = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
      file: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'],
    };

    const fileType = getFileType(file);
    const maxSize = maxSizes[fileType];
    const allowedFormatsList = allowedFormats[fileType];

    if (file.size > maxSize) {
      return { valid: false, error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` };
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedFormatsList.includes(fileExtension)) {
      return { valid: false, error: `File format not allowed. Allowed formats: ${allowedFormatsList.join(', ')}` };
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
      onFileUploaded(result.fileUrl, result.fileName, result.messageType);

      // Remove from uploading files after a delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      
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
        <p className="text-sm text-gray-600">
          Drag and drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Images (5MB), Videos (50MB), Documents (10MB)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(uploadingFile.file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
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
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </>
                )}
                
                {uploadingFile.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                
                {uploadingFile.status === 'error' && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600">{uploadingFile.error}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatFileUpload;
