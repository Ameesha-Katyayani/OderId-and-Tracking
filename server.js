const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

let bearerShipToken = "";
let tokenShipExpiry = new Date();

const DELHIVERY_API_TOKEN = "4e1f89ad2cf0bbadf1df3cdeded6301bab0ac3bb";
const SHIPROCKET_EMAIL = "katyayanimanager@gmail.com";
const SHIPROCKET_PASSWORD = "Kyu@121";
const DELHIVERY_API_URL =
  "https://track.delhivery.com/api/v1/packages/json/?waybill&ref_ids=";
const SHIPROCKET_API_URL =
  "https://apiv2.shiprocket.in/v1/external/courier/track?order_id=";

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/track/:trackingId", async (req, res) => {
  const { trackingId } = req.params;

  try {
    const shiprocketData = await fetchShiprocketTracking(trackingId);
    if (shiprocketData) {
      return res.json(shiprocketData);
    }

    const delhiveryData = await fetchDelhiveryTracking(trackingId);
    if (delhiveryData) {
      return res.json(delhiveryData);
    }

    res.status(404).json({ error: "Tracking information not found." });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tracking information." });
  }
});
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    bearerShipToken = response.data.token;
    tokenShipExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error("Error refreshing Shiprocket access token:", error);
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

async function fetchDelhiveryTracking(waybill) {
  try {
    const response = await axios.get(`${DELHIVERY_API_URL}${waybill}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${DELHIVERY_API_TOKEN}`,
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
