import React, { useMemo, useState } from 'react';
import PdfExportButton from './PdfExportButton';

const ResultsSection = ({ analysisResults, handleProceed }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const objects = analysisResults?.detectedObjects || [];

  const stats = useMemo(() => {
    const count = objects.length;
    if (!count) {
      return { avgConfidence: 0, avgDiameter: 0, totalVolume: 0 };
    }

    return {
      avgConfidence: (objects.reduce((sum, o) => sum + (o.confidence || 0), 0) / count) * 100,
      avgDiameter: objects.reduce((sum, o) => sum + (o.diameter_real || 0), 0) / count,
      totalVolume: objects.reduce((sum, o) => sum + (o.volume_real || 0), 0),
    };
  }, [objects]);

  if (!analysisResults) return null;

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            Boulder Detection Complete
          </h3>
        </div>

        <div className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-2 border-gray-600 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
          <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-200">Detection Visualization</h4>
          {analysisResults.visualizationImage ? (
            <div className="max-w-full overflow-hidden rounded-lg sm:rounded-xl border-2 border-gray-600 shadow-lg">
              <img
                src={`http://localhost:5000${analysisResults.visualizationImage}`}
                alt="Detection visualization"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Visualization not available.</p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-200">Detected Boulders</p>
            <p className="text-lg font-bold text-blue-100">{analysisResults.totalObjects || objects.length}</p>
          </div>
          <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
            <p className="text-xs text-purple-200">Avg Confidence</p>
            <p className="text-lg font-bold text-purple-100">{stats.avgConfidence.toFixed(1)}%</p>
          </div>
          <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3">
            <p className="text-xs text-orange-200">Avg Diameter</p>
            <p className="text-lg font-bold text-orange-100">{stats.avgDiameter.toFixed(2)} m</p>
          </div>
          <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-xs text-emerald-200">Total Volume</p>
            <p className="text-lg font-bold text-emerald-100">{stats.totalVolume.toFixed(2)} m<sup>3</sup></p>
          </div>
        </div>

        <div className="mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-bold text-gray-100">Boulders Table</h4>
          </div>

          {objects.length === 0 ? (
            <p className="text-gray-400 text-sm">No boulders were found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-gray-200">
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span>Object</span>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span>Confidence</span>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <span>Diameter (m)</span>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        <span>Area (m<sup>2</sup>)</span>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                        <span>Volume (m<sup>3</sup>)</span>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span>Circularity</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {objects.map((obj, idx) => (
                    <tr key={idx} className="text-gray-200">
                      <td className="px-3 py-4">
                        <div className="flex items-start space-x-3">
                          <span className="w-3 h-3 rounded-full bg-orange-400 mt-1"></span>
                          <div>
                            <div className="font-semibold text-gray-100">Boulder #{idx + 1}</div>
                            <div className="text-xs text-gray-400">
                              {obj.degradation_state !== 'N/A' ? obj.degradation_state : 'Standard'}
                            </div>
                            {obj.bounding_box && (
                              <div className="text-xs text-gray-500 mt-1">
                                BBox: ({obj.bounding_box.x1}, {obj.bounding_box.y1}) - ({obj.bounding_box.x2}, {obj.bounding_box.y2})
                              </div>
                            )}
                            <button
                              onClick={() => setSelectedObject({ obj, index: idx })}
                              className="mt-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200"
                            >
                              More details
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="inline-flex w-12 h-12 rounded-full border-2 border-gray-600 items-center justify-center bg-gray-800/60">
                          <span className="text-xs font-bold">{(obj.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="inline-flex min-w-[90px] justify-center px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-200 font-semibold">
                          {(obj.diameter_real || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="inline-flex min-w-[90px] justify-center px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 font-semibold">
                          {(obj.area_real || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="inline-flex min-w-[90px] justify-center px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-200 font-semibold">
                          {(obj.volume_real || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center min-w-[110px] px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-200 font-semibold">
                          <span>{(obj.circularity || 0).toFixed(3)}</span>
                          <span className="text-xs text-yellow-300">Elong: {(obj.elongation || 0).toFixed(3)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleProceed}
            className="bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 hover:from-blue-600 hover:via-indigo-700 hover:to-blue-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
          >
            Back to Dashboard
          </button>
          <PdfExportButton analysisResults={analysisResults} />
        </div>

        {selectedObject && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-white">
                  Boulder #{selectedObject.index + 1} Details
                </h5>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="w-8 h-8 rounded-lg bg-gray-700/60 hover:bg-gray-600/60 text-gray-200 flex items-center justify-center"
                  aria-label="Close details"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6L18 18" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {selectedObject.obj.bounding_box && (
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/60 lg:aspect-square">
                    <div className="text-sm font-semibold text-purple-300 mb-3">Bounding Box (Pixels)</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                        <span className="text-gray-400">X1</span>
                        <span className="text-purple-200 font-semibold">{selectedObject.obj.bounding_box.x1}</span>
                      </div>
                      <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                        <span className="text-gray-400">Y1</span>
                        <span className="text-purple-200 font-semibold">{selectedObject.obj.bounding_box.y1}</span>
                      </div>
                      <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                        <span className="text-gray-400">X2</span>
                        <span className="text-purple-200 font-semibold">{selectedObject.obj.bounding_box.x2}</span>
                      </div>
                      <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                        <span className="text-gray-400">Y2</span>
                        <span className="text-purple-200 font-semibold">{selectedObject.obj.bounding_box.y2}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/60 lg:aspect-square">
                  <div className="text-sm font-semibold text-green-300 mb-3">Real Measurements</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Width</span>
                      <span className="text-green-200 font-semibold">{(selectedObject.obj.width_real || 0).toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Height</span>
                      <span className="text-green-200 font-semibold">{(selectedObject.obj.height_real || 0).toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Diameter</span>
                      <span className="text-green-200 font-semibold">{(selectedObject.obj.diameter_real || 0).toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Area</span>
                      <span className="text-green-200 font-semibold">{(selectedObject.obj.area_real || 0).toFixed(2)}m<sup>2</sup></span>
                    </div>
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Volume</span>
                      <span className="text-green-200 font-semibold">{(selectedObject.obj.volume_real || 0).toFixed(2)}m<sup>3</sup></span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/60 lg:aspect-square">
                  <div className="text-sm font-semibold text-yellow-300 mb-3">Shape Properties</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Circularity</span>
                      <span className="text-yellow-200 font-semibold">{(selectedObject.obj.circularity || 0).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Elongation</span>
                      <span className="text-yellow-200 font-semibold">{(selectedObject.obj.elongation || 0).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between bg-gray-800/40 p-2 rounded border border-gray-700/50">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-yellow-200 font-semibold">{(selectedObject.obj.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;






