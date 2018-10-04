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


    $(".button").on("click", function (event) {
        // In this case, the "this" keyword refers to the button that was clicked
        event.preventDefault();

        var apiKeyMapquest = "VhIG9vrD4t2JMvh5f9k61v8rcGERpvxV";
        cityState = $("input").val().trim();
        console.log(cityState);
        database.ref().push(cityState);

        var queryUrl = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + apiKeyMapquest + '&location=' + cityState;
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            var results = response.results;
            console.log(results)

            var lat = results[0].locations[0].displayLatLng.lat;
            var lon = results[0].locations[0].displayLatLng.lng;
            database.ref().push(lat);
            database.ref().push(lon);

            var queryURL2 = "https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=" + lat + "&lon=" + lon
            console.log(queryURL2);
            // Performing our AJAX GET request
            $.ajax({
                url: queryURL2,
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
                    };




                })


        });
    });

    // $('#sighting').append('<li>' + time.toString() + '</li');

});
