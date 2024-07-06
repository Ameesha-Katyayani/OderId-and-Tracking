const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const DELHIVERY_API_URL = "https://track.delhivery.com/api/v1/packages/json/?waybill&ref_ids=";

app.get("/track", async (req, res) => {
  const { trackingId } = req.query;
  if (!trackingId) {
    return res.status(400).json({ error: "Tracking ID is required" });
  }
  
  const delhiveryData = await fetchDelhiveryTracking(trackingId);
  if (delhiveryData) {
    return res.json(delhiveryData);
  } else {
    return res.status(500).json({ error: "Error fetching tracking information." });
  }
});

async function fetchDelhiveryTracking(waybill) {
  try {
    const response = await axios.get(`${DELHIVERY_API_URL}${waybill}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token 4e1f89ad2cf0bbadf1df3cdeded6301bab0ac3bb`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Delhivery tracking data:", error);
    return null;
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
