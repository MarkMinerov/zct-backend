import base64 from "base-64";
import axios from "axios";

function transformMatrix(matrix) {
  return matrix.map((row) => row.map((item) => [parseFloat(item)]));
}

export default (conn, AI_URL) => {
  return async (req, res) => {
    try {
      const { encoded } = req.body;

      const encodedImage = JSON.parse(base64.decode(encoded));
      const transformedImage = transformMatrix(encodedImage);

      const data = JSON.stringify({
        signature_name: "serving_default",
        instances: [transformedImage],
      });

      const response = await axios.post(AI_URL, data);
      const predictions = response.data.predictions;
      let predictionNumber;

      if (predictions.length > 0 && Array.isArray(predictions[0])) {
        predictionNumber = predictions[0].indexOf(Math.max(...predictions[0]));
      } else {
        predictionNumber = predictions[0];
      }

      res.json({ predictionNumber });
    } catch (error) {
      console.error("Error making prediction:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
