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
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external/courier/track?order_id=";
const SHIPROCKET_EMAIL = 'katyayanimanager@gmail.com';
const SHIPROCKET_PASSWORD = 'Kyu@121';

let bearerShipToken = '';
let tokenShipExpiry = new Date();

app.get("/track", async (req, res) => {
  const { trackingId, provider } = req.query;
  if (!trackingId) {
    return res.status(400).json({ error: "Tracking ID is required" });
  }
  if (!provider) {
    return res.status(400).json({ error: "Provider is required" });
  }

  let trackingData;

  if (provider === 'delhivery') {
    trackingData = await fetchDelhiveryTracking(trackingId);
  } else if (provider === 'shiprocket') {
    trackingData = await fetchShiprocketTracking(trackingId);
  } else {
    return res.status(400).json({ error: "Invalid provider" });
  }

  if (trackingData) {
    return res.json(trackingData);
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

async function fetchShiprocketTracking(orderId) {
  if (new Date() > tokenShipExpiry) {
    await refreshAccessToken();
  }

  try {
    const response = await axios.get(`${SHIPROCKET_API_URL}${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerShipToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Shiprocket tracking data:", error);
    return null;
  }
}

async function refreshAccessToken() {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    bearerShipToken = response.data.token;
    tokenShipExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log("Refreshed Shiprocket access token:", bearerShipToken);
  } catch (error) {
    console.error("Error refreshing Shiprocket access token:", error);
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
