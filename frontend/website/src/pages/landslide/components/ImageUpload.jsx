import React, { useRef, useState } from 'react';

const ImageUpload = ({ onImageUpload, isUploading }) => {
  const [selectedFileName, setSelectedFileName] = useState('');
  const [pathError, setPathError] = useState('');
  const fileInputRef = useRef(null);

  const validateFilePath = (path) => {
    if (!path.trim()) {
      return 'Please enter a file path';
    }

    const validExtensions = ['.tif', '.tiff', '.asc', '.dem'];
    const hasValidExtension = validExtensions.some((ext) => path.toLowerCase().endsWith(ext));

    if (!hasValidExtension) {
      return 'Supported formats: .tif, .tiff, .asc, .dem';
    }

    return null;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const candidatePath = file.path || file.name || '';
    const error = validateFilePath(candidatePath);
    if (error) {
      setPathError(error);
      return;
    }

    setSelectedFileName(file.name || candidatePath);
    setPathError('');
    onImageUpload({ type: 'path', path: candidatePath.trim() });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-4 sm:py-6 px-0">
      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto">
        <div className="relative rounded-2xl p-5 sm:p-6 border-2 border-dashed border-orange-500/30 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 shadow-2xl overflow-hidden text-center">
      <div className="relative z-10 space-y-5 w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept=".tif,.tiff,.asc,.dem"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 512 512">
              <path d="M256 32c12.5 0 24.1 6.4 30.8 17L503.4 394.4c5.6 8.9 8.6 19.2 8.6 29.7c0 30.9-25 55.9-55.9 55.9H55.9C25 480 0 455 0 424.1c0-10.5 3-20.8 8.6-29.7L225.2 49c6.6-10.6 18.3-17 30.8-17zm65 192L256 120.4 176.9 246.5l18.3 24.4c6.4 8.5 19.2 8.5 25.6 0l25.6-34.1c6-8.1 15.5-12.8 25.6-12.8h49z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-gray-200 to-orange-300 bg-clip-text text-transparent">Upload DEM for Terrain Analysis</h3>
          <p className="text-sm text-gray-300">Choose DEM file for lunar terrain risk analysis</p>
        </div>

        <div>
          <button
            onClick={handleBrowseClick}
            disabled={isUploading}
            className={`bg-gradient-to-r from-orange-500 via-red-600 to-orange-700 hover:from-orange-600 hover:via-red-700 hover:to-orange-800 px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-orange-500/50 inline-flex items-center space-x-2 text-sm sm:text-base ${
              isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 512 512">
              <path d="M256 32c12.5 0 24.1 6.4 30.8 17L503.4 394.4c5.6 8.9 8.6 19.2 8.6 29.7c0 30.9-25 55.9-55.9 55.9H55.9C25 480 0 455 0 424.1c0-10.5 3-20.8 8.6-29.7L225.2 49c6.6-10.6 18.3-17 30.8-17zm65 192L256 120.4 176.9 246.5l18.3 24.4c6.4 8.5 19.2 8.5 25.6 0l25.6-34.1c6-8.1 15.5-12.8 25.6-12.8h49z" />
            </svg>
            <span>Choose DEM</span>
          </button>
        </div>

        <div className="bg-gray-700/60 rounded-lg p-4 shadow text-center">
          <p className="text-sm font-semibold text-gray-100 mb-2">Supported formats:</p>
          <div className="space-y-1 text-xs sm:text-sm text-orange-100">
            <p>GeoTIFF (.tif, .tiff)</p>
            <p>ASC (.asc)</p>
            <p>DEM (.dem)</p>
          </div>
        </div>

        {selectedFileName && <p className="text-green-400 text-sm font-semibold">Selected: {selectedFileName}</p>}
        {pathError && <p className="text-sm text-red-400">{pathError}</p>}
      </div>
    </div>
      </div>
    </section>
  );
};

export default ImageUpload;
