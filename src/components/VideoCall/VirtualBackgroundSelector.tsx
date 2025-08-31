"use client";
import { useVideoCallContext } from "@/hooks/VideoCallContext";
import {
    Camera,
    ChevronLeft,
    ChevronRight,
    Image,
    Palette,
    Settings,
    Sparkles,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface VirtualBackgroundSelectorProps {
  selectedBackground: string | null;
  onBackgroundChange: (background: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const VirtualBackgroundSelector: React.FC<VirtualBackgroundSelectorProps> = ({
  selectedBackground,
  onBackgroundChange,
  isOpen,
  onClose,
  className = ''
}) => {
  const { virtualBackgrounds } = useVideoCallContext();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(virtualBackgrounds.length / itemsPerPage);

  if (!isOpen) return null;

  const handleBackgroundSelect = (background: any) => {
    onBackgroundChange(background.value);
  };

  const getCurrentBackgrounds = () => {
    const start = currentPage * itemsPerPage;
    return virtualBackgrounds.slice(start, start + itemsPerPage);
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}>
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Virtual Background</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Background Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {getCurrentBackgrounds().map((background) => (
            <button
              key={background.id}
              onClick={() => handleBackgroundSelect(background)}
              className={`relative group p-3 rounded-xl border-2 transition-all duration-300 ${
                selectedBackground === background.value
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
            >
              {/* Preview Image */}
              <div className="w-full h-20 rounded-lg overflow-hidden mb-2 bg-gray-800">
                <img
                  src={background.preview}
                  alt={background.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Background Name */}
              <p className="text-white/90 text-sm font-medium text-center">
                {background.name}
              </p>

              {/* Selected Indicator */}
              {selectedBackground === background.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentPage === 0
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPage ? 'bg-purple-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentPage === totalPages - 1
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Info Text */}
        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs">
            Choose a virtual background to enhance your video call experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualBackgroundSelector;
