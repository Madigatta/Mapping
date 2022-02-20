// TOKEN
const TOKEN =
  "pk.eyJ1IjoiZmxvcmlhbi1mbG9jb24iLCJhIjoiY2tldjJ1a3A5NDB1ZTJzcGNpOGJ1OTRxcSJ9.kFHGE_fRa8nxG2UN7DAaNA";

let myMap;
let markers;

// ACCES A LA GEOLOCALISATION
// DOCUMENTATION  -> propriété "navigator"
// si le navigateur supporte la géoloc'
// console.log(navigator)
if ("geolocation" in navigator) {
  // on execute une fonction de la propriété navigator en lui passant en argument notre fonction showMyMapWithMyPosition
  navigator.geolocation.getCurrentPosition(showMyMapWithMyPosition);
} else {
  // sinon on insulte l'utilisateur afin qu'il upgrade son Internet Explorer de ses morts
  alert("TON IE N'EST PAS SUPPORTE");
}

// montrer notre position sur la map
function showMyMapWithMyPosition(position) {
  // console.log(position);
  // console.log(position.coords.latitude);
  // console.log(position.coords.longitude);
  // initialiser la map en lui passant notre position : "une fonction"
  createMap(position.coords.latitude, position.coords.longitude);
  // on fait apparaitre le formulaire
  $("#search").removeClass("hide");
  // envoyer la requete de notre formulaire : "gestionnaire d'evenement au submit"
  $("#search").on("submit", function (e) {
    // on supprime le comportement par defaut
    e.preventDefault();
    // et on récupére les lieux : fonction qui prendra 2 arguments de localisation
    getPlacesNearMyPosition(
      position.coords.latitude,
      position.coords.longitude
    );
  });
}

// fonction d'initialisation de la map et du marker de position
function createMap(latitude, longitude) {
  // console.log(latitude, longitude);
  // définir le centre géographique et le zoom de la map
  myMap = L.map("mapid").setView([latitude, longitude], 13);
  // préparer le marker et l'ajouter à la map
  markers = L.layerGroup().addTo(myMap);
  // charger la map et ses propriétés(penser au token) DOC -> tileLayer
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: TOKEN,
    }
  ).addTo(myMap);

  // initialiser l'icone de position (L.icon)
  myIcon = L.icon({
    iconUrl: "img/bluecircle.png",
    iconSize: [10, 10],
  });

  // on place notre icone/marker de position sur la map (L.marker)
  let marker = L.marker([latitude, longitude], { icon: myIcon }).addTo(myMap);
}

// fonction de récupération des lieux
function getPlacesNearMyPosition(lat, lng) {
  // console.log(lat, lng)
  // Récupérer la valeur entrée dans le formulaire
  let input = $("#business").val();
  // Effacer les anciens markers (voir leaflet)
  markers.clearLayers();
  //requète AJAX vers openstreetmap en lui passant la valeur récupérer ainsi que la position (voir API openstreetmap) // nominatim
  $.ajax({
    url: ` https://nominatim.openstreetmap.org/search?q=${input} ${lat} ${lng}&format=geocodejson`,
  }).done((places) => {
    //récupération de la réponse AJAX
    // console.log(places)
    //récupération des places
    // on test qu'on récup bien les places dans la console
    // console.log(places.features);
    //on fait une boucle pour afficher toutes les places renvoyé en réponse (boucle .map ES6)
    places.features.map((place) => {
      // place représente la valeur de chaque index du tableau et "index" est l'index 0, 1, 2 à chaque tour de boucle
      // création du marker en fonction des coordonnées du lieu
      let marker = L.marker([
        place.geometry.coordinates[1],
        place.geometry.coordinates[0],
      ]).addTo(myMap);
      //on stock ce qu'on va afficher dans la popup
      let popUpContent = `<p>${place.properties.geocoding.label}</p>`;

      //création de la popup sur le marker (bindPopup)
      marker.bindPopup(popUpContent);

      //ajout du marker à la map (addLayer)
      markers.addLayer(marker);
    });
  });
}
