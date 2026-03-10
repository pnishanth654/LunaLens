import React from 'react';

const ResultsSection = ({ analysisResults, handleProceed }) => {
  if (!analysisResults) return null;

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-2xl sm:max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-2xl sm:max-w-3xl mb-6">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-2 border-gray-600 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-200">
                Landslide Result
              </h4>
              {analysisResults.visualizationImage ? (
                <div className="flex justify-center">
                  <div className="w-52 h-52 sm:w-64 sm:h-64 bg-gray-800/60 rounded-lg sm:rounded-xl border-2 border-green-500/30 shadow-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={`http://localhost:5000${analysisResults.visualizationImage}`}
                      alt="Landslide result"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Result image not available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleProceed}
            className="bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 hover:from-blue-600 hover:via-indigo-700 hover:to-blue-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/50"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M256 32c12.5 0 24.1 6.4 30.8 17L503.4 394.4c5.6 8.9 8.6 19.2 8.6 29.7c0 30.9-25 55.9-55.9 55.9H55.9C25 480 0 455 0 424.1c0-10.5 3-20.8 8.6-29.7L225.2 49c6.6-10.6 18.3-17 30.8-17zm65 192L256 120.4 176.9 246.5l18.3 24.4c6.4 8.5 19.2 8.5 25.6 0l25.6-34.1c6-8.1 15.5-12.8 25.6-12.8h49z" />
              </svg>
              <span>Back to Dashboard</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
