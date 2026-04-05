import app from "../server/src/index.js";

export default async function handler(req, res) {
  try {
    // Ensure the Express app handles the request
    return app(req, res);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Internal Server Error during bridge",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
