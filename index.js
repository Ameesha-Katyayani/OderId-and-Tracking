// const url = 'https://http-cors-proxy.p.rapidapi.com/';
// const options = {
// 	method: 'POST',
// 	headers: {
// 		'x-rapidapi-key': '9147d18b40msh507eb3d5fdcf60dp12917cjsnd18cb37f6313',
// 		'x-rapidapi-host': 'http-cors-proxy.p.rapidapi.com',
// 		'Content-Type': 'application/json',
// 		Origin: 'www.example.com',
// 		'X-Requested-With': 'www.example.com'
// 	},
// 	body: {
// 		url: 'https://track.delhivery.com/api/v1/packages/json/?waybill&ref_ids='
// 	}
// };

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}


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
          if (data && data[0] && data[0][trackingId]) {
            const trackingData = data[0][trackingId].tracking_data;

            if (trackingData.error) {
              trackingResult.textContent = trackingData.error;
            } else {
              trackingResult.innerHTML = `
              <h3>Tracking Information</h3>
              <p><strong>Status:</strong> ${
                trackingData.shipment_track[0].current_status || "N/A"
              }</p>
              <p><strong>Courier Name:</strong> ${
                trackingData.shipment_track[0].courier_name || "N/A"
              }</p>
              <p><strong>Consignee Name:</strong> ${
                trackingData.shipment_track[0].consignee_name || "N/A"
              }</p>
              <p><strong>Destination:</strong> ${
                trackingData.shipment_track[0].destination || "N/A"
              }</p>
              <p><strong>Delivered Date:</strong> ${
                trackingData.shipment_track[0].delivered_date || "N/A"
              }</p>
              <p><strong>Origin:</strong> ${
                trackingData.shipment_track[0].origin || "N/A"
              }</p>
            `;
            }
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
  const response = await fetch("http://localhost:3000/track/${trackingId}", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
    //body: JSON.stringify({ trackingId }),
  });

  if (response.ok) {
    return response.json();
  } else {
    console.error("Failed to fetch tracking information", response.statusText);
    return null;
  }
}
