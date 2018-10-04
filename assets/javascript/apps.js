$(document).ready(function () {
    console.log("testing");

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

    $("#button").on("click", function (event) {
        // In this case, the "this" keyword refers to the button that was clicked
        event.preventDefault();

        var apiKeyMapquest = VhIG9vrD4t2JMvh5f9k61v8rcGERpvxV;
        cityState = $("#input").val().trim();

        var queryUrl = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + apiKeyMapquest + '&location=' + cityState

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(query);

            var results = response.data;
            var lat = results.latLng.lat;
            var lon = results.latLng.lng;
        })

        var queryURL = "https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=" + lat + "&lon=" + lon
        console.log(queryURL);
        // Performing our AJAX GET request
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After the data comes back from the API
            .then(function (response) {
                console.log(response);

          // Storing an array of results in the results variable
          for (var i = 0; i < response.response.length; i++) {
            var time = response.response[i].risetime;

            var duration = response.duration;

            var dateString = moment.unix(time).format('LLLL');
            console.log(time);
            console.log(dateString);
            //


          }
            })
    });

});
