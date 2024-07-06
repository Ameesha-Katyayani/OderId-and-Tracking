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
  const { trackingId } = req.query;
  if (!trackingId) {
    console.error("Tracking ID is required.");
    return res.status(400).json({ error: "Tracking ID is required" });
  }

  console.log(`Fetching tracking information for ID: ${trackingId}`);

  let trackingData = await fetchDelhiveryTracking(trackingId);

  if (!trackingData) {
    console.log("No data found in Delhivery, trying Shiprocket...");
    trackingData = await fetchShiprocketTracking(trackingId);
  }

  if (trackingData) {
    console.log("Tracking information fetched successfully.");
    return res.json(trackingData);
  } else {
    console.error("Error fetching tracking information from both providers.");
    return res.status(500).json({ error: "Error fetching tracking information." });
  }
});

async function fetchDelhiveryTracking(waybill) {
  try {
    console.log(`Fetching Delhivery tracking data for waybill: ${waybill}`);
    const response = await axios.get(`${DELHIVERY_API_URL}${waybill}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token 4e1f89ad2cf0bbadf1df3cdeded6301bab0ac3bb`,
      },
    });

    if (response.data && response.data.ShipmentData && response.data.ShipmentData.length > 0) {
      console.log("Delhivery tracking data found.");
      return { provider: 'delhivery', data: response.data.ShipmentData[0].Shipment };
    } else {
      console.log("No Delhivery tracking data found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Delhivery tracking data:", error.response ? error.response.data : error.message);
    return null;
  }
}

async function fetchShiprocketTracking(orderId) {
  if (new Date() > tokenShipExpiry) {
    await refreshAccessToken();
  }

  try {
    console.log(`Fetching Shiprocket tracking data for order ID: ${orderId}`);
    const response = await axios.get(`${SHIPROCKET_API_URL}${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerShipToken}`,
      },
    });

    if (response.data && response.data.data) {
      console.log("Shiprocket tracking data found.");
      return { provider: 'shiprocket', data: response.data.data };
    } else {
      console.log("No Shiprocket tracking data found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Shiprocket tracking data:", error.response ? error.response.data : error.message);
    return null;
  }
}

async function refreshAccessToken() {
  try {
    console.log("Refreshing Shiprocket access token...");
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
    console.error("Error refreshing Shiprocket access token:", error.response ? error.response.data : error.message);
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
