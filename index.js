var animation = lottie.loadAnimation({
  container: document.getElementById("lottie-animation"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "LootieAnimation.json",
});

document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var orderId = document.getElementById("orderId").value;
    var result = document.getElementById("result");
    var shortenInstruction = document.getElementById("shortenInstruction");
    var copyButton = document.getElementById("copyButton");

    if (orderId) {
      var baseUrl =
        "https://krishisevakendraofficial.page.link/?afl=https%3A%2F%2Fwww.krishisevakendra.in&amv=125&apn=com.katyayani.krishisevakendra&link=https%3A%2F%2Fkrishisevakendra.in%3Fid%3DTracking";
      var fullUrl = baseUrl + encodeURIComponent(orderId);
      result.innerHTML =
        'Generated Link: <a href="' +
        fullUrl +
        '" target="_blank">' +
        fullUrl +
        "</a>";
      result.style.color = "green";

      copyButton.style.display = "inline-flex";
      //  shortenInstruction.innerHTML = 'To shorten this URL, <a href="https://tinyurl.com/create.php?url=' + encodeURIComponent(fullUrl) + '" target="_blank">click here to create a TinyURL</a>.';
      shortenInstruction.style.color = "black";
    } else {
      result.textContent = "Please enter an Order ID.";
      result.style.color = "red";
      copyButton.style.display = "none";
      shortenInstruction.textContent = "";
    }
  });

function copyToClipboard() {
  var linkText = document.querySelector("#result a").href;
  var tempInput = document.createElement("input");
  document.body.appendChild(tempInput);
  tempInput.value = linkText;
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  var notification = document.getElementById("notification");
  notification.className = "notification show";
  setTimeout(function () {
    notification.className = notification.className.replace("show", "");
  }, 3000);
}
document
  .getElementById("trackOrderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var trackingId = document.getElementById("trackingId").value;
    var trackingResult = document.getElementById("trackingResult");

    if (trackingId) {
      trackOrder(trackingId)
        .then((data) => {
          console.log("Tracking data:", data);
          if (data) {
            trackingResult.innerHTML = `
                    <h3>Tracking Information</h3>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Current Location:</strong> ${data.current_location}</p>
                    <p><strong>Expected Delivery:</strong> ${data.expected_delivery}</p>
                    <p><strong>Details:</strong> ${data.details}</p>
                `;
          } else {
            trackingResult.textContent = "Tracking information not found.";
          }
        })
        .catch((error) => {
          trackingResult.textContent = "Error fetching tracking information.";
          console.error("Error fetching tracking information:", error);
        });
    } else {
      trackingResult.textContent = "Please enter a Tracking ID.";
    }
  });

async function refreshAccessToken() {
  try {
    const response = await fetch(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "katyayanimanager@gmail.com",
          password: "Kyu@121",
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      bearerShipToken = data.token;
      tokenShipExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours
      console.log("Shiprocket token refreshed successfully:", bearerShipToken);
    } else {
      console.error("Failed to refresh access token", response.statusText);
    }
  } catch (e) {
    console.error("Error refreshing access token:", e);
  }
}

async function fetchShiprocketTracking(orderId) {
  if (new Date() > tokenShipExpiry) {
    await refreshAccessToken();
  }

  try {
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerShipToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Shiprocket tracking info:", data);
      return data;
    } else {
      console.error(
        "Failed to fetch Shiprocket tracking info",
        response.statusText
      );
      return null;
    }
  } catch (e) {
    console.error("Error fetching Shiprocket tracking info:", e);
    return null;
  }
}

async function fetchDelhiveryTracking(waybill) {
  try {
    const response = await fetch(
      `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 4e1f89ad2cf0bbadf1df3cdeded6301bab0ac3bb`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Delhivery tracking info:", data);
      return data;
    } else {
      console.error(
        "Failed to fetch Delhivery tracking info",
        response.statusText
      );
      return null;
    }
  } catch (e) {
    console.error("Error fetching Delhivery tracking info:", e);
    return null;
  }
}

async function trackOrder(trackingId) {
  let trackingInfo;

  if (trackingId.startsWith("SR")) {
    trackingInfo = await fetchShiprocketTracking(trackingId);
  } else {
    trackingInfo = await fetchDelhiveryTracking(trackingId);
  }

  if (trackingInfo) {
    return {
      status: trackingInfo.status || "Unknown",
      current_location: trackingInfo.current_location || "Unknown",
      expected_delivery: trackingInfo.expected_delivery || "Unknown",
      details: JSON.stringify(trackingInfo),
    };
  } else {
    return null;
  }
}
