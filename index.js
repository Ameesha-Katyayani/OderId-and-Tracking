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
      // shortenInstruction.innerHTML = 'To shorten this URL, <a href="https://tinyurl.com/create.php?url=' + encodeURIComponent(fullUrl) + '" target="_blank">click here to create a TinyURL</a>.';
      shortenInstruction.style.color = "black";
    } else {
      result.textContent = "Please enter an Order ID.";
      result.style.color = "red";
      copyButton.style.display = "none";
      shortenInstruction.textContent = "";
    }
  });

document
  .getElementById("trackOrderButton")
  .addEventListener("click", function () {
    var trackingId = document.getElementById("orderId").value;
    var trackingResult = document.getElementById("trackingResult");

    console.log("Tracking ID entered:", trackingId);

    if (trackingId) {
      trackOrder(trackingId)
        .then((data) => {
          console.log("Tracking Data:", data);
          if (data) {
            displayTrackingData(data);
          } else {
            trackingResult.textContent = "Tracking information not found.";
            trackingResult.style.color = "red";
            trackingResult.style.display = "block";
          }
        })
        .catch((error) => {
          trackingResult.textContent = "Error fetching tracking information.";
          trackingResult.style.color = "red";
          trackingResult.style.display = "block";
          console.error("Error fetching tracking information:", error);
        });
    } else {
      trackingResult.textContent = "Please enter a Tracking ID.";
      trackingResult.style.color = "red";
      trackingResult.style.display = "block";
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
  trackingResult.style.display = "block";

  if (data.provider === "delhivery") {
    const trackingData = data.data;
    const latestScan =
      trackingData.Scans[trackingData.Scans.length - 1].ScanDetail;

    trackingResult.innerHTML = `
      <h3>Tracking Information</h3>
      <p><strong>Status:</strong> ${trackingData.Status.Status || "N/A"}</p>
      <p><strong>Current Location:</strong> ${
        trackingData.Status.StatusLocation || "N/A"
      }</p>
      <p><strong>Expected Delivery:</strong> ${
        new Date(trackingData.ExpectedDeliveryDate).toLocaleString() || "N/A"
      }</p>
    `;
  } else if (data.provider === "shiprocket") {
    const trackingData = data.data;
    trackingResult.innerHTML = `
      <h3>Tracking Information</h3>
      <p><strong>Status:</strong> ${
        trackingData.shipment_track[0].current_status || "N/A"
      }</p>
      <p><strong>Shipment ID:</strong> ${
        trackingData.shipment_track[0].id || "N/A"
      }</p>
      <p><strong>Pickup Date:</strong> ${
        trackingData.shipment_track[0].pickup_date || "N/A"
      }</p>
      <p><strong>Delivered Date:</strong> ${
        trackingData.shipment_track[0].delivered_date || "N/A"
      }</p>
      <p><strong>Current Status:</strong> ${
        trackingData.shipment_track[0].current_status || "N/A"
      }</p>
    `;
  }
}
// Select the hamburger menu button and the drawer
const menuButton = document.getElementById("menuButton");
const drawer = document.getElementById("drawer");

// Function to toggle drawer visibility
menuButton.addEventListener("click", () => {
  drawer.classList.toggle("open"); // Toggles the "open" class to show/hide the drawer
});

// Function to close the drawer
function closeDrawer() {
  drawer.classList.remove("open"); // Removes the "open" class to hide the drawer
}

// Navigate to the user screen
function navigateToUserScreen() {
  window.location.href = "users.html"; // Redirect to another HTML page
  closeDrawer(); // Close the drawer after navigation
}
function navigateToSoilTestingScreen() {
  window.location.href = "soilTesting.html"; // Redirect to the Soil Testing screen (soilTesting.html)
  closeDrawer(); // Close the drawer after navigation
}
function navigateToWaterTestingScreen() {
  window.location.href = "waterTesting.html"; // Redirect to the Soil Testing screen (soilTesting.html)
  closeDrawer(); // Close the drawer after navigation
}
