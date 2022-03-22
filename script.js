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
  for (i = 0; i < entries.length; i++) {
    var marker = L.marker(response["entries"][i]["coordinates"]).addTo(map);
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

// Set circle
var circle = L.circle([51.690486599927794, 5.296194152088851], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 556.5995
}).addTo(map);

// Set markers
var marker = L.marker([51.690486599927794, 5.296194152088851]).addTo(map);

// Add entries
displayEntries();
