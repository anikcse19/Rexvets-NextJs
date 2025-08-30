"use client";

import React, { useState, useEffect } from 'react';
import { Image, Video, File, Download, ExternalLink, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessageAttachmentProps {
  url: string;
  fileName: string;
  messageType: "image" | "video" | "file";
  fileSize?: number;
  className?: string;
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({
  url,
  fileName,
  messageType,
  fileSize,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(url);

  // Update imageUrl when url prop changes
  useEffect(() => {
    setImageUrl(url);
    setImageLoading(true);
    setImageError(false);
  }, [url]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    switch (messageType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };

  const handleVideoToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleImageClick = () => {
    setShowFullImage(true);
  };

  // Image Attachment
  if (messageType === 'image') {
    return (
      <>
        <div className={`relative group ${className}`}>
          {!imageError ? (
            <div className="relative">
              {imageLoading && (
                <div className="max-w-xs max-h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                </div>
              )}
              <div className="relative">
                {/* Clean image display with background-image */}
                <div
                  className="max-w-xs max-h-64 rounded-lg cursor-pointer"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '200px',
                    minWidth: '200px',
                    backgroundColor: 'transparent'
                  }}
                  onClick={handleImageClick}
                >
                  {/* Hidden img for onload detection */}
                  <img
                    src={imageUrl}
                    alt={fileName}
                    style={{ display: 'none' }}
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl);
                      setImageError(true);
                      setImageLoading(false);
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', imageUrl);
                      setImageLoading(false);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-2">
                {getFileIcon()}
                <span className="text-sm text-gray-600">{fileName}</span>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 break-all">
                URL: {imageUrl}
              </div>
            </div>
          )}
        </div>

        {/* Full Image Modal */}
        {showFullImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowFullImage(false)}
          >
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={url}
                alt={fileName}
                className="max-w-full max-h-full object-contain bg-gray-50"
                style={{
                  filter: 'none',
                  opacity: 1
                }}
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'max-w-full max-h-full flex items-center justify-center text-gray-500 text-lg bg-gray-100 rounded';
                  fallback.textContent = 'Image failed to load';
                  target.parentNode?.appendChild(fallback);
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={() => setShowFullImage(false)}
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Video Attachment
  if (messageType === 'video') {
    return (
      <div className={`relative group ${className}`}>
        {!videoError ? (
          <div className="relative">
            <video
              src={url}
              className="max-w-xs max-h-64 rounded-lg"
              controls={isVideoPlaying}
              onError={() => setVideoError(true)}
              onLoadedData={() => setImageLoading(false)}
            />
            {!isVideoPlaying && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleVideoToggle}
                  className="bg-white/90 hover:bg-white"
                >
                  <Play className="w-6 h-6" />
                </Button>
              </div>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleOpenInNewTab}
                className="bg-white/90 hover:bg-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="bg-white/90 hover:bg-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
            {getFileIcon()}
            <span className="text-sm text-gray-600">{fileName}</span>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // File Attachment
  if (messageType === 'file') {
    return (
      <div className={`relative group ${className}`}>
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
          {getFileIcon()}
          <span className="text-sm text-gray-600">{fileName}</span>
          <Badge variant="outline">{formatFileSize(fileSize || 0)}</Badge>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default MessageAttachment;
