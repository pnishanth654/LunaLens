import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import AnalysisResults from './components/AnalysisResults';

// Helper to map backend JSON results to frontend analysisData structure
function mapBackendResultsToAnalysisData(results) {
  const slopeJson = results['slope_analysis_results.json'];
  const slopeStats = slopeJson?.statistics || {};
  const slope = slopeJson
    ? {
        riskLevel: slopeJson.analysis_results?.risk_level || 'N/A',
        riskFactors: slopeJson.analysis_results?.risk_factors || [],
        statistics: {
          min: slopeStats.min_value ?? slopeStats.min ?? 0,
          max: slopeStats.max_value ?? slopeStats.max ?? 0,
          mean: slopeStats.mean_value ?? slopeStats.mean ?? 0,
          stdDev: slopeStats.std_dev ?? slopeStats.std ?? 0,
        },
        thresholds: slopeJson.thresholds || {},
      }
    : undefined;

  const elevJson = results['elevation_statistics_results.json'];
  const elevation = elevJson
    ? {
        riskLevel: 'N/A',
        riskFactors: [],
        statistics: {
          min: elevJson.min_elevation,
          max: elevJson.max_elevation,
          mean: elevJson.mean_elevation,
          stdDev: elevJson.std_elevation,
          range: elevJson.elevation_range,
        },
        thresholds: {},
        elevationDistribution: {},
      }
    : undefined;

  const curvJson = results['curvature_statistics_results.json'];
  const curvature = curvJson
    ? {
        riskLevel: 'N/A',
        riskFactors: [],
        statistics: {
          profileCurvatureMean: curvJson.profile_mean,
          profileCurvatureStd: curvJson.profile_std,
          planCurvatureMean: curvJson.plan_mean,
          planCurvatureStd: curvJson.plan_std,
          gaussianCurvatureMean: curvJson.gaussian_mean,
          gaussianCurvatureStd: curvJson.gaussian_std,
          meanCurvatureMean: curvJson.mean_mean,
          meanCurvatureStd: curvJson.mean_std,
        },
        thresholds: {},
      }
    : undefined;

  const triJson = results['terrain_ruggedness_pipeline_summary.json'];
  let triStats;
  if (triJson?.results?.ruggedness_analysis) {
    triStats = triJson.results.ruggedness_analysis;
  } else if (triJson?.calculation_results?.ruggedness_analysis) {
    triStats = triJson.calculation_results.ruggedness_analysis;
  }
  const roughness = triStats
    ? {
        riskLevel: triStats.category || 'N/A',
        riskFactors: [triStats.description || ''],
        statistics: {
          min: triStats.min_tri,
          max: triStats.max_tri,
          mean: triStats.mean_tri,
          std: triStats.std_tri,
        },
        percentiles: {},
        terrainDistribution: {},
        categories: {},
      }
    : undefined;

  const contourJson = results['contour_analysis_results.json'];
  const contours = contourJson
    ? {
        terrainComplexity: contourJson.terrain_complexity,
        statistics: {
          numberOfContours: contourJson.num_contours,
          numberOfLevels: contourJson.num_levels,
          contourDensity: contourJson.contour_density,
          elevationRange: { min: contourJson.elevation_range?.[0], max: contourJson.elevation_range?.[1] },
        },
        elevationDistribution: contourJson.elevation_distribution,
      }
    : undefined;

  const riskJson = results['lunar_risk_analysis_results.json'];
  const composite = riskJson
    ? {
        overallRisk: {
          score: riskJson.composite_risk_score,
          level: riskJson.risk_level,
          description: riskJson.risk_description,
        },
        components:
          (riskJson.individual_risk_scores &&
            Object.entries(riskJson.individual_risk_scores).map(([name, riskScore]) => ({
              name: name.toUpperCase(),
              riskScore,
              weight: riskJson.parsed_reports?.[name]?.weight || 0,
              weightedContribution: riskScore * (riskJson.parsed_reports?.[name]?.weight || 0),
            }))) ||
          [],
        weights: riskJson.weights || {},
        analysis: riskJson.analysis_summary || {},
      }
    : undefined;

  return {
    slope,
    elevation,
    curvature,
    roughness,
    contours,
    composite,
  };
}

const TerrainAnalysis = () => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (fileData) => {
    setIsUploading(true);
    setShowResults(false);
    setAnalysisStarted(false);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mockFile = {
      name: fileData.path.split(/[\\/]/).pop(),
      size: 1024 * 1024 * 50,
      type: 'image/tiff',
      path: fileData.path,
    };

    setImage(mockFile);
    setIsUploading(false);
  };

  const startAnalysis = async () => {
    if (!image) return;

    setAnalysisStarted(true);
    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);

    try {
      const response = await fetch('http://localhost:5000/api/lunar-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dem_path: image.path }),
      });

      const data = await response.json();
      if (data.success) {
        const mapped = mapBackendResultsToAnalysisData(data.results);
        setAnalysisData(mapped);
        setShowResults(true);
      } else {
        setError(data.error || 'Analysis failed.');
      }
    } catch (err) {
      setError('Error connecting to backend.');
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071635] via-[#0b1b3d] to-[#071635] text-gray-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-red-500/5 to-orange-500/8 animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full pt-3 sm:pt-4">
        <HeroSection />

        <div className="px-4 sm:px-6 space-y-5 sm:space-y-6">
          <div className="w-full max-w-2xl sm:max-w-3xl mx-auto">
            <ImageUpload onImageUpload={handleImageUpload} isUploading={isUploading} />
          </div>

          {image && (
            <div className="w-full max-w-2xl sm:max-w-3xl mx-auto">
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  isAnalyzing
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white hover:shadow-xl'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <span>Start Terrain Analysis</span>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="w-full max-w-2xl sm:max-w-3xl mx-auto p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
              {error}
            </div>
          )}

          {image && analysisStarted && (
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 sm:gap-5 items-stretch">
              <div className="bg-gradient-to-br from-gray-800/90 via-gray-700/80 to-gray-800/90 rounded-2xl p-4 border border-gray-600/40 shadow-2xl backdrop-blur-sm relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-red-500/5 to-orange-500/8 animate-pulse"></div>
                <div className="relative z-10 w-full h-full flex flex-col">
                  <h3 className="text-lg font-bold text-gray-100 mb-3">Uploaded File Details</h3>
                  <div className="space-y-2.5 text-sm flex-1">
                    <div className="bg-gray-900/35 rounded-lg p-2.5 border border-gray-600/40">
                      <p className="text-gray-400">File Name</p>
                      <p className="text-gray-100 font-semibold break-all">{image.name || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-900/35 rounded-lg p-2.5 border border-gray-600/40">
                      <p className="text-gray-400">Format</p>
                      <p className="text-gray-100 font-semibold">{(image.name?.split('.').pop() || 'N/A').toUpperCase()}</p>
                    </div>
                    <div className="bg-gray-900/35 rounded-lg p-2.5 border border-gray-600/40">
                      <p className="text-gray-400">File Size</p>
                      <p className="text-gray-100 font-semibold">{image.size ? `${(image.size / (1024 * 1024)).toFixed(1)} MB` : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-900/35 rounded-lg p-2.5 border border-gray-600/40">
                      <p className="text-gray-400">Status</p>
                      <p className="text-green-400 font-semibold">{isAnalyzing ? 'Analyzing...' : 'Analysis started'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <ImagePreview image={image} isAnalyzing={isAnalyzing} />
            </div>
          )}

          <AnalysisResults isVisible={showResults} analysisData={analysisData} />
        </div>
      </div>
    </div>
  );
};

export default TerrainAnalysis;
