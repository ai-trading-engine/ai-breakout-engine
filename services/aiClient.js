import axios from "axios";

export async function getPrediction(features) {
  const response = await axios.post(
    process.env.AI_SERVICE_URL,
    features
  );

  return response.data.probability;
}
