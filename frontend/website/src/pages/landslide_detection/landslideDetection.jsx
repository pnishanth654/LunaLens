import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeroSection,
  ImageUpload,
  ConfirmationSection,
  ResultsSection,
  Footer
} from './components';
import './landslide.css';

const LANDSLIDE_ANALYSIS_TYPE = 'advanced';

const Landslide = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/landslide/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const analyzeImage = async (filepath, analysisType) => {
    try {
      const response = await fetch('http://localhost:5000/api/landslide/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filepath: filepath,
          analysisType: analysisType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  const handleStartAnalysis = async () => {
    if (!uploadedFile) {
      setError('Please upload an image before starting analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Upload image
      const uploadResult = await uploadImage(uploadedFile);
      
      // Analyze image
      const analysisResult = await analyzeImage(uploadResult.filepath, LANDSLIDE_ANALYSIS_TYPE);
      
      if (analysisResult.success) {
        const visualizationImage = analysisResult.additional_files?.find(file => file.type === 'visualization')?.path;
        setAnalysisResults({ visualizationImage });
      } else {
        setError(analysisResult.message || 'Analysis failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProceed = () => {
    navigate('/dashboard');
  };

  const getAnalysisName = (analysisType) => {
    switch (analysisType) {
      case 'basic':
        return 'Basic Landslide Detection';
      case 'advanced':
        return 'Advanced Analysis with ViT Fallback';
      case 'depth':
        return 'Depth Estimation Analysis';
      case 'gradcam':
        return 'Grad-CAM Visualization Analysis';
      default:
        return 'Analysis';
    }
  };
  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      <main className="min-h-screen bg-gray-900">
        <HeroSection />

        <ImageUpload 
          uploadedImage={uploadedImage}
          handleImageUpload={handleImageUpload}
        />

        <ConfirmationSection 
          showConfirmation={!!uploadedFile}
          selectedAnalysis={LANDSLIDE_ANALYSIS_TYPE}
          getAnalysisName={getAnalysisName}
          error={error}
          isAnalyzing={isAnalyzing}
          handleStartAnalysis={handleStartAnalysis}
        />

        <ResultsSection 
          analysisResults={analysisResults}
          handleProceed={handleProceed}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Landslide; 
