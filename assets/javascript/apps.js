$(document).ready(function () {
  console.log("shuttle launch");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA_R2VV4g9p_YDXXcOufIF_neOG8k_jn7E",
    authDomain: "iss-tracker-217915.firebaseapp.com",
    databaseURL: "https://iss-tracker-217915.firebaseio.com",
    projectId: "iss-tracker-217915",
    storageBucket: "",
    messagingSenderId: "25655744600"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $(".button").on("click", function (event) {
    // In this case, the "this" keyword refers to the button that was clicked
    event.preventDefault();
    $("#city-search").empty();
    $("#last-5-results").empty();

    var apiKeyMapquest = "VhIG9vrD4t2JMvh5f9k61v8rcGERpvxV";
    var userInput = $("input").val();
    var cityState = userInput.trim();
    console.log(cityState);

    var queryUrl =
      "https://www.mapquestapi.com/geocoding/v1/address?key=" +
      apiKeyMapquest +
      "&location=" +
      cityState;
    console.log(queryUrl);
    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function (response) {
      var results = response.results;
      console.log(results);

      var lat = results[0].locations[0].displayLatLng.lat;
      var lon = results[0].locations[0].displayLatLng.lng;
      database.ref().push(lat);
      database.ref().push(lon);

      var queryURL2 =
        "https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=" +
        lat +
        "&lon=" +
        lon;
      console.log(queryURL2);
      // Performing our AJAX GET request
      $.ajax({
        url: queryURL2,
        method: "GET"
      })
        // After the data comes back from the API
        .then(function (response) {
          console.log(response);

          var arr = [];
          // Storing an array of results in the results variable
          for (var i = 0; i < response.response.length; i++) {
            arr.push(response.response[i].risetime);

            // var duration = response.response[i].duration;
            // console.log(duration);
          }
          console.log(arr);

          var dtFinal = [];

          for (var i = 0; i < arr.length; i++) {
            var time = arr[i];
            // console.log(time);

            var dateString = dtFinal.push(moment.unix(time).format("LLLL"));
          }

          var newSearch = {
            search: cityState,
            results: dtFinal,
          }

          database.ref().push(newSearch);

          $("#city-search").prepend(
            $("<tr>").text(cityState)
          );

          for (let i = 0; i < dtFinal.length; i++) {
            $("#last-5-results").append(
              $("<tr>").text(dtFinal[i])
            )
          }
          console.log(dtFinal);
          userInput = $("input").val("");
        });

      // $('#sighting').append('<li>' + time.toString() + '</li');
    })
  });

  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    //store all the info into a variable
    var citySearch = childSnapshot.val().search;
    var seeISS = childSnapshot.val().results;

    function resultsList(){
    for (let i = 0; i < seeISS.length; i++) {
      $("#results-table").prepend(
        $("<tr>").text(seeISS[i]))
      }
    }

    var newRow = $("<tr>").append(
      $("<td>").text(citySearch),
      $("<td>").text(resultsList()),
    )
    $("#results-table").prepend(newRow);
  });

  var mymap = null;

  function moveIss() {
    if (mymap !== null) mymap.remove();

    var queryURL = "https://api.wheretheiss.at/v1/satellites/25544";

    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        console.log(response);

        console.log(response.latitude);
        console.log(response.longitude);

        var altitude = response.altitude;
        var velocity = response.velocity;
        var visibility = response.visibility;
        var latitude = response.latitude;
        var longitude = response.longitude;

        var altitudeN = altitude.toFixed(2);
        var velocityN = velocity.toFixed(2);
        var latitudeN = latitude.toFixed(4);
        var longitudeN = longitude.toFixed(4);

        $("#latitudeN").text("Latitude: " + latitudeN),
          $("#longitudeN").text("Longitude: " + longitudeN),
          $("#altitude").text(
            "Altitude: " + altitudeN + "    Kilometers above the Earth"
          ),
          $("#velocity").text("Velocity: " + velocityN + "    KPH");
        $("#visibility").text("Visibility: " + visibility);

        mymap = L.map("mapid").setView([latitudeN, longitudeN], 4);

        var issIcon = L.icon({
          iconUrl: "assets/images/issColor.png",

          iconSize: [10, 24], // size of the icon
          iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
          popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        L.tileLayer(
          "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 15,
            id: "mapbox.streets",
            accessToken:
              "pk.eyJ1IjoicG1hY2s5OSIsImEiOiJjam1zNXh4c2owMGc5M3dwN2ZjeWloc2t5In0.OJ_GGAfAJgMK0OCnN2NbhA"
          }
        ).addTo(mymap);

        L.marker([latitudeN, longitudeN], { icon: issIcon }).addTo(mymap);
        //.bindPopup('The ISS')
        //.openPopup();
      });
    setTimeout(moveIss, 4000);

  }
  if (mymap !== null) mymap.remove();
  moveIss();

  //variables for the ISS location button clicks
  var latitude = "";
  var longitude = "";
  var altitude = "";
  var velocity = "";
  var mymap = null;

  var i = 0;
  var queryURL = "https://images-api.nasa.gov/search?q=iss&media_type=image"

  $.ajax({
    url: queryURL,
    method: "GET"
  })

    .then(function (response) {
      console.log(response);

      function issImages() {

        $("#apod1 img").remove();
        $("#apod2 img").remove();


        i = Math.floor(Math.random() * 49 + 1);
        j = Math.floor((Math.random() * 49 + 1) + 50);
        console.log(i);
        console.log(j);

        var apod1 = response.collection.items[i].links[0].href;
        var apod2 = response.collection.items[j].links[0].href;
        var image1 = $("<img>").attr("src", apod1);
        var image2 = $("<img>").attr("src", apod2);


        $("#apod1").append(image1);
        $("#apod2").append(image2);


      }

      issImages();

      var groundPhoto = ["assets/images/ISS_Photos/pic0.jpg", "assets/images/ISS_Photos/pic1.jpg", "assets/images/ISS_Photos/pic2.jpg", "assets/images/ISS_Photos/pic3.jpg", "assets/images/ISS_Photos/pic4.jpg"];

      function groundImages() {
        $("#apod0 img").remove();

        var k = Math.floor(Math.random() * groundPhoto.length);

        console.log(k);

        var apod0 = groundPhoto[k];
        var image0 = $("<img>");
        image0.attr("src", apod0);
        image0.attr("height", "1000");


         $("#apod0").append(image0);


};

        groundImages();
        

        $(".btn-floating").on("click", function () {
          groundImages();
          issImages();
        });


      });
    });