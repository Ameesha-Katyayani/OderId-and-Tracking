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

    const trackingId = document.getElementById("trackingId").value;
    const trackingResult = document.getElementById("trackingResult");

    console.log("Tracking ID entered:", trackingId);

    if (trackingId) {
      trackOrder(trackingId)
        .then((data) => {
          console.log("Tracking Data:", data);
          if (data) {
            displayTrackingData(data);
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

async function trackOrder(trackingId) {
  try {
    const response = await fetch(
      `https://oderid-and-tracking.onrender.com/track?trackingId=${trackingId}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Response data:", data);
      return data;
    } else {
      console.error(
        "Failed to fetch tracking information",
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error in trackOrder function:", error);
    return null;
  }
}

function displayTrackingData(data) {
  const trackingResult = document.getElementById("trackingResult");

  if (data.provider === "delhivery") {
    const trackingData = data.data;
    const scans = trackingData.Scans.map(
      (scan) => `
      <p>
        <strong>Date:</strong> ${new Date(
          scan.ScanDetail.ScanDateTime
        ).toLocaleString()}<br/>
        <strong>Status:</strong> ${scan.ScanDetail.Scan}<br/>
        <strong>Location:</strong> ${scan.ScanDetail.ScannedLocation}<br/>
        <strong>Instructions:</strong> ${scan.ScanDetail.Instructions}
      </p>
    `
    ).join("");

    trackingResult.innerHTML = `
      <h3>Tracking Information</h3>
      <p><strong>Status:</strong> ${trackingData.Status.Status || "N/A"}</p>
      <p><strong>Current Location:</strong> ${
        trackingData.Status.StatusLocation || "N/A"
      }</p>
      <p><strong>Expected Delivery:</strong> ${
        new Date(trackingData.ExpectedDeliveryDate).toLocaleString() || "N/A"
      }</p>
      <div><strong>Scans:</strong> ${scans}</div>
    `;
  } else if (data.provider === "shiprocket") {
    const trackingData = data.data;
    trackingResult.innerHTML = `
      <h3>Tracking Information</h3>
      <p><strong>Status:</strong> ${
        trackingData.shipment_track.current_status || "N/A"
      }</p>
      <p><strong>Shipment ID:</strong> ${
        trackingData.shipment_track.id || "N/A"
      }</p>
      <p><strong>Pickup Date:</strong> ${
        trackingData.shipment_track.pickup_date || "N/A"
      }</p>
      <p><strong>Delivered Date:</strong> ${
        trackingData.shipment_track.delivered_date || "N/A"
      }</p>
      <p><strong>Current Status:</strong> ${
        trackingData.shipment_track.current_status || "N/A"
      }</p>
    `;
  }
}
