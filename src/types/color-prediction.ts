// Color Prediction types
export interface ColorPrediction {
  color: string;
  percentage: number;
  description: string;
}

export interface ColorPredictionRequest {
  sireId: string;
  damId: string;
}

export interface ColorPredictionResponse {
  predictions: ColorPrediction[];
  parentColors: {
    sire: string;
    dam: string;
  };
  confidence: number;
}
