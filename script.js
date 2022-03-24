// Retrieve data
function getData() {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "data.json");
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
        return this.responseText;
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
    xhr.send();
  });
}

async function displayEntries() {
  response = JSON.parse(await getData());
  entries = response["entries"];
  for (i = 0; i < response["entries"].length; i++) {
    
    // Get entry link details
    var links = "<br><br>";
    var linksEmpty = true;
    if (response["entries"][i].hasOwnProperty("links")) {
        for (var key in response["entries"][i]["links"]) {
            links = links + "<a href='" + response["entries"][i]["links"][key] + "'>" + key + "</a><br>";
            linksEmpty = false;
        }
    }
    if (linksEmpty) {
      links = "";
    }
    
    // Add marker
    var marker = L.marker(entries[i]["coordinates"]).addTo(map);
    // Add popup
    marker.bindPopup("<b>" + entries[i]["name"] + "</b>" + "<br><br>" + "<img src='avatars/" + entries[i]["avatar"] + "' width='80' height='80'>" + "<br><br>" + entries[i]["description"] + links )
    // Add circle
    var circle = L.circle(entries[i]["coordinates"], {
        color: entries[i]["color"],
        fillColor: entries[i]["color"],
        fillOpacity: 0.2,
        radius: entries[i]["approximation"]
    }).addTo(map);
  }
}

// Map creation
var map = L.map('map', {
  attributionControl: false,
  // center: [51.690486599927794, 5.296194152088851],
  center: [0, 0],
  zoom: 2,
});

//
map.locate({setView: true, maxZoom: 10});

// Set tile provider
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Set attribution
L.control.attribution().setPrefix("").addAttribution('Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors').addTo(map);

// Add entries
displayEntries();
