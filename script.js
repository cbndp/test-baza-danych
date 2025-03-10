// Initialize the Leaflet map
var map = L.map('map').setView([54.5, 18.5], 7);

// Add Google Earth-style satellite map
L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps'
}).addTo(map);

// ✅ Store markers and regions globally
let placeMarkers = {};
let allMarkers = L.layerGroup().addTo(map);
let historicalRegions = new Set();
let modernRegions = new Set();

// ✅ Fetch GeoJSON data from the backend API
fetch("http://localhost:3000/places")
    .then(response => response.json())
    .then(data => {

        let markers = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                let marker = L.circleMarker(latlng, {
                    radius: 5,
                    color: 'black',
                    fillColor: 'white',
                    fillOpacity: 1,
                    weight: 2
                });

               // ✅ Store markers with their original capitalization
                placeMarkers[feature.properties.modern_name.toLowerCase()] = {
                marker: marker,
                originalName: feature.properties.modern_name // ✅ Keep original capitalization
                };

                // ✅ Store historical & modern regions for dropdowns
                if (feature.properties.historical_region) {
                    historicalRegions.add(feature.properties.historical_region);
                }
                if (feature.properties.modern_region) {
                    modernRegions.add(feature.properties.modern_region);
                }

                return marker;
            },
            onEachFeature: function (feature, layer) {
                let props = feature.properties;
                let popupContent = `
                    <h3>${props.modern_name}</h3>
                    <p><strong>Miejsce ID:</strong> ${props.id}</p>
                    <p><strong>Nazwa Historyczna:</strong> ${props.historical_name || 'N/A'}</p>
                    <p><strong>Region Historyczny:</strong> ${props.historical_region || 'N/A'}</p>
                    <p><strong>Region Nowoczesny:</strong> ${props.modern_region || 'N/A'}</p>
                    <p><strong>Terytoria:</strong> ${props.territory || 'N/A'}</p>
                `;
                layer.bindPopup(popupContent);
                allMarkers.addLayer(layer);
            }
        });

        // ✅ Populate the historical region dropdown
        let histDropdown = document.getElementById("regionDropdown");
        historicalRegions.forEach(region => {
            let option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            histDropdown.appendChild(option);
        });

        // ✅ Populate the modern region dropdown
        let modDropdown = document.getElementById("modernRegionDropdown");
        modernRegions.forEach(region => {
            let option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            modDropdown.appendChild(option);
        });

    })
    .catch(error => console.error("❌ Error loading places:", error));

// ✅ Function to filter by historical region
function filterByRegion() {
    let selectedRegion = document.getElementById("regionDropdown").value;
    
    allMarkers.clearLayers(); // Remove all markers first

    if (!selectedRegion) {
        allMarkers.addTo(map); // Show all markers if no region is selected
        return;
    }

    fetch("http://localhost:3000/places")
        .then(response => response.json())
        .then(data => {
            let filteredMarkers = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    if (feature.properties.historical_region === selectedRegion) {
                        return L.circleMarker(latlng, {
                            radius: 5,
                            color: 'black',
                            fillColor: 'white',
                            fillOpacity: 1,
                            weight: 2
                        });
                    }
                },
                onEachFeature: function (feature, layer) {
                    let props = feature.properties;
                    let popupContent = `
                        <h3>${props.modern_name}</h3>
                        <p><strong>Miejsce ID:</strong> ${props.id}</p>
                        <p><strong>Nazwa Historyczna:</strong> ${props.historical_name || 'N/A'}</p>
                        <p><strong>Region Historyczny:</strong> ${props.historical_region || 'N/A'}</p>
                        <p><strong>Region Nowoczesny:</strong> ${props.modern_region || 'N/A'}</p>
                        <p><strong>Terytoria:</strong> ${props.territory || 'N/A'}</p>
                    `;
                    layer.bindPopup(popupContent);
                    allMarkers.addLayer(layer);
                }
            });

            allMarkers.addTo(map);
        })
        .catch(error => console.error("❌ Error filtering by region:", error));
}

// ✅ Function to filter by modern region
function filterByModernRegion() {
    let selectedModernRegion = document.getElementById("modernRegionDropdown").value;
    
    allMarkers.clearLayers(); // Remove all markers first

    if (!selectedModernRegion) {
        allMarkers.addTo(map); // Show all markers if no region is selected
        return;
    }

    fetch("http://localhost:3000/places")
        .then(response => response.json())
        .then(data => {
            let filteredMarkers = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    if (feature.properties.modern_region === selectedModernRegion) {
                        return L.circleMarker(latlng, {
                            radius: 5,
                            color: 'black',
                            fillColor: 'white',
                            fillOpacity: 1,
                            weight: 2
                        });
                    }
                },
                onEachFeature: function (feature, layer) {
                    let props = feature.properties;
                    let popupContent = `
                        <h3>${props.modern_name}</h3>
                        <p><strong>Miejsce ID:</strong> ${props.id}</p>
                        <p><strong>Nazwa Historyczna:</strong> ${props.historical_name || 'N/A'}</p>
                        <p><strong>Region Historyczny:</strong> ${props.historical_region || 'N/A'}</p>
                        <p><strong>Region Nowoczesny:</strong> ${props.modern_region || 'N/A'}</p>
                        <p><strong>Terytoria:</strong> ${props.territory || 'N/A'}</p>
                    `;
                    layer.bindPopup(popupContent);
                    allMarkers.addLayer(layer);
                }
            });

            allMarkers.addTo(map);
        })
        .catch(error => console.error("❌ Error filtering by modern region:", error));
}
// ✅ Search function for place names
function searchPlaces() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let searchResults = document.getElementById("searchResults");

    // Clear previous search results
    searchResults.innerHTML = "";
    searchResults.style.display = "none";

    if (input.length < 2) return; // Don't search for very short queries

    let results = Object.keys(placeMarkers).filter(name => name.includes(input)).map(name => placeMarkers[name].originalName);

    if (results.length > 0) {
        searchResults.style.display = "block";
        results.forEach(name => {
            let li = document.createElement("li");
            li.innerText = name;
            li.onclick = function () {
                let marker = placeMarkers[name];
                if (marker) {
                    map.setView(marker.getLatLng(), 10); // ✅ Zoom to the marker
                    marker.openPopup(); // ✅ Open the popup
                }
                searchResults.style.display = "none"; // Hide search results
            };
            searchResults.appendChild(li);
        });
    }
}
// ✅ Function to handle pressing "Enter" in the search bar
function handleEnter(event) {
    if (event.key === "Enter") {
        let searchBox = document.getElementById("searchBox");
        let searchQuery = searchBox.value.trim().toLowerCase(); // ✅ Get user input in lowercase

        // ✅ Check if the place exists in `placeMarkers`
        if (placeMarkers[searchQuery]) {
            let markerData = placeMarkers[searchQuery]; // Retrieve marker info

            map.setView(markerData.marker.getLatLng(), 10); // ✅ Zoom to the exact place
            markerData.marker.openPopup(); // ✅ Open the popup for this place

            // ✅ Clear the search box after selecting
            searchBox.value = "";
            document.getElementById("searchResults").style.display = "none"; // Hide dropdown
        } else {
            alert("Place not found. Please select from the suggestions."); // ❌ Handle unknown place
        }
    }
}

