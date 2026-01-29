// Wrap everything in this "DOMContentLoaded" function
document.addEventListener('DOMContentLoaded', function() {

    // 1. Global Variables
    var userLocation = null;
    var routingControl = null;
    var userMarker = null;

    // 2. Initialize Map (Check if 'map' div exists)
    var mapElement = document.getElementById('map');
    if (!mapElement) return; // Stop if the map div isn't found

    var map = L.map('map').setView([27.7172, 85.3240], 13);

    // 3. Add Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '(c) OpenStreetMap contributors'
    }).addTo(map);

    // 4. Define Icon
    var medicalIcon = L.divIcon({
        className: 'hospital-logo', 
        html: '<span>+</span>',     
        iconSize: [32, 32],         
        iconAnchor: [16, 16],
        popupAnchor: [0, -15] 
    });

    // 5. Hospital Data
    
var hospitals = [
    { name: "Bir Hospital", lat: 27.7051, lng: 85.3134, tel: "+977-1-4221988" },
    { name: "Kathmandu Valley Hospital", lat: 27.7016, lng: 85.3092, tel: "+977-1-4255330" },
    { name: "Civil Service Hospital of Nepal", lat: 27.7293, lng: 85.3249, tel: "+977-1-4793000" },
    { name: "Venus Hospital", lat: 27.7068, lng: 85.3276, tel: "+977-1-4475120" },
    { name: "Vayodha Hospital", lat: 27.7039, lng: 85.3056, tel: "+977-1-4281666" },
    { name: "Grande International Hospital", lat: 27.7366, lng: 85.3269, tel: "+977-1-5159266" },
    { name: "Tribhuvan University Teaching Hospital", lat: 27.7379, lng: 85.3319, tel: "+977-1-4412303" },
    { name: "Kathmandu Hospital (Tripureshwor)", lat: 27.6943, lng: 85.3111, tel: "+977-1-4229656" },
    { name: "Kathmandu Neuro & General Hospital", lat: 27.7010, lng: 85.3164, tel: "+977-1-5327735" },
    { name: "Sukraraj Tropical & Infectious Disease Hospital (Teku)", lat: 27.6948, lng: 85.3065, tel: "+977-1-5353396" },
    { name: "Nepal Eye Hospital (Tripureshwor)", lat: 27.6949, lng: 85.3146, tel: "+977-1-4260813" },
    { name: "Everest Hospital", lat: 27.7105, lng: 85.3198, tel: "+977-1-4793024" },
    { name: "Om Hospital & Research Center", lat: 27.7146, lng: 85.3324, tel: "+977-1-4476225" },
    { name: "Annapurna Neuro Hospital", lat: 27.7063, lng: 85.3257, tel: "+977-1-4256656" },
    { name: "Norvic International Hospital", lat: 27.6901, lng: 85.3189, tel: "+977-1-5970032" },
    { name: "Blue Cross Hospital", lat: 27.6949, lng: 85.3142, tel: "+977-1-4262027" },
    { name: "Paropakar Maternity & Women’s Hospital", lat: 27.6976, lng: 85.3093, tel: "+977-1-4261363" },
    { name: "Nepal National Hospital (Kalanki)", lat: 27.6949, lng: 85.2820, tel: "+977-1-5225101" },
    { name: "Himal Hospital", lat: 27.7102, lng: 85.3283, tel: "+977-1-4515076" },
    { name: "Tilganga Institute of Ophthalmology", lat: 27.7054, lng: 85.3507, tel: "+977-1-4493684" },
    { name: "National Trauma Center", lat: 27.7043, lng: 85.3131, tel: "+977-1-4239161" },
    { name: "Shahid Gangalal National Heart Centre", lat: 27.7458, lng: 85.3436, tel: "+977-1-4371322" },
    { name: "KMC Hospital (Sinamangal)", lat: 27.6963, lng: 85.3535, tel: "+977-1-4469064" },
    { name: "Kanti Children’s Hospital", lat: 27.7328, lng: 85.3291, tel: "+977-1-4411134" },
    { name: "Nepal Mediciti Hospital", lat: 27.6685, lng: 85.3174, tel: "+977-1-4217766" },
    { name: "B & B Hospital", lat: 27.6729, lng: 85.3125, tel: "+977-1-5540731" },
    { name: "Bhaktapur Cancer Hospital", lat: 27.6712, lng: 85.4183, tel: "+977-1-6611532" },
    { name: "Alka Hospital (Jawalakhel)", lat: 27.6722, lng: 85.3117, tel: "+977-1-5555555" },
    { name: "Star Hospital (Sanepa)", lat: 27.6744, lng: 85.3123, tel: "+977-1-5450731" },
    { name: "Madhyapur Hospital", lat: 27.6731, lng: 85.3868, tel: "+977-1-5093388" },
    { name: "Nepal Police Hospital", lat: 27.7303, lng: 85.3235, tel: "+977-1-4412530" },
    { name: "Birendra Army Hospital (Chhauni)", lat: 27.6986, lng: 85.2932, tel: "+977-1-4271941" },
    { name: "HAMS Hospital", lat: 27.7377, lng: 85.3472, tel: "+977-1-4377404" },
    { name: "Medicare National Hospital", lat: 27.7072, lng: 85.3416, tel: "+977-1-4467067" },
    { name: "Nepal Korea Friendship Hospital", lat: 27.6794, lng: 85.3623, tel: "+977-1-6633414" },
    { name: "KIST Medical College", lat: 27.6584, lng: 85.3436, tel: "+977-1-5201496" }
];
    // 6. Add Markers
    hospitals.forEach(function(h) {
        var popupContent = '<strong>' + h.name + '</strong><br>' +
                           '<a href="tel:' + h.tel + '" style="color: #dc2626; font-weight: bold;">📞 Call ' + h.tel + '</a>';
        L.marker([h.lat, h.lng], {icon: medicalIcon}).addTo(map).bindPopup(popupContent);
    });

    // 7. Locate User
    map.locate({setView: true, maxZoom: 15, watch: true});

    map.on('locationfound', function(e) {
        userLocation = e.latlng;
        if (userMarker) {
            userMarker.setLatLng(e.latlng);
        } else {
            userMarker = L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
        }
    });

    // 8. SOS Logic (Attached to window so HTML can find it)
    window.findNearest = function() {
        if (!userLocation) {
            alert("Detecting location... please wait.");
            return;
        }

        var closest = null;
        var minDistance = Infinity;

        hospitals.forEach(function(h) {
            var dist = userLocation.distanceTo([h.lat, h.lng]);
            if (dist < minDistance) {
                minDistance = dist;
                closest = h;
            }
        });

        if (closest) {
            if (routingControl) { map.removeControl(routingControl); }

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation.lat, userLocation.lng),
                    L.latLng(closest.lat, closest.lng)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                show: false,
                createMarker: function() { return null; }
            }).addTo(map);

            alert("Nearest: " + closest.name);
        }
    };
});