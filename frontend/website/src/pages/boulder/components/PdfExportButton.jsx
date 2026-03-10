import React, { useState } from 'react';

const PdfExportButton = ({ analysisResults, disabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!analysisResults || disabled || isExporting) return;

    try {
      setIsExporting(true);
      const response = await fetch('http://localhost:5000/api/boulder/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisResults }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Excel export failed');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/i);
      const filename = match?.[1] || `boulder_detection_report_${Date.now()}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel export error:', error);
      alert(`Excel export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting || !analysisResults}
      className={`
        bg-gradient-to-r from-green-500 via-emerald-600 to-green-700
        hover:from-green-600 hover:via-emerald-700 hover:to-green-800
        px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base
        transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
        shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <span className="flex items-center space-x-2">
        {isExporting ? (
          <>
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Exporting Excel...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 512 512">
              <path d="M256 32c12.5 0 24.1 6.4 30.8 17L503.4 394.4c5.6 8.9 8.6 19.2 8.6 29.7c0 30.9-25 55.9-55.9 55.9H55.9C25 480 0 455 0 424.1c0-10.5 3-20.8 8.6-29.7L225.2 49c6.6-10.6 18.3-17 30.8-17zm65 192L256 120.4 176.9 246.5l18.3 24.4c6.4 8.5 19.2 8.5 25.6 0l25.6-34.1c6-8.1 15.5-12.8 25.6-12.8h49z" />
            </svg>
            <span>Export</span>
          </>
        )}
      </span>
    </button>
  );
};

export default PdfExportButton;
