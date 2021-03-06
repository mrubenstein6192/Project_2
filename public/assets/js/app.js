// allows for signUp
function signUp(event) {
  event.preventDefault();

  const userData = {
    firstName: $("#first-name-input")
      .val()
      .trim(),
    lastName: $("#last-name-input")
      .val()
      .trim(),
    email: $("#email-input")
      .val()
      .trim(),
    password: $("#password-input")
      .val()
      .trim(),
  };

  if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
    return swal({
      title: "Please double check what you entered and try again!",
      icon: "error"
    });
  }

  $.ajax({
      url: "/api/user/register",
      method: "POST",
      data: userData
    }).then(function (userData) {
      console.log(userData);
      return swal({
        title: userData.message,
        icon: "success"
      })
    })
    .then(function () {
      $("#signup").tab("hide");
      $("#login").tab("show");

    })
    .catch(err => {
      console.log(err);
      return swal({
        title: err.responseJSON.error,
        icon: "error"
      });
    });
}

// allows for login submissions
function login(event) {
  event.preventDefault();

  const userData = {
    email: $("#email-input-login")
      .val()
      .trim(),
    password: $("#password-input-login")
      .val()
      .trim()
  };

  if (!userData.email || !userData.password) {
    return swal({
      title: "Looks like you're missing something, please try again!",
      icon: "error"
    });
  }

  $.ajax({
      url: "/api/user/login",
      method: "POST",
      data: userData
    })
    .then(function (accessToken) {
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      getUserProfile();
    })
    .catch(err => {
      console.log(err);
      return swal({
        title: err.responseJSON.error,
        icon: "error"
      });
    });
}

// allows for logouts
function logout() {
  localStorage.removeItem('accessToken');
  $("#user-info").hide();
  $("#user-tabs, #forms, #logup, #right-column-title").show();
  $("#login").tab("show");
}

//pulls db profile info
function getUserProfile() {
  const token = localStorage.getItem("accessToken");

  $.ajax({
      url: "/api/user",
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then(function (userData) {
      $("#user-tabs, #forms, #logup, #right-column-title").hide();
      $("#user-info").show();
      $("#full-name").text(userData.fullName);
    })
    .catch(err => {
      console.log(err);
      handleError(err.responseJSON);
    });
}

// handles any errors during log in, sign up, and get user
function handleError(errorData) {
  swal({
    title: "Please login",
    text: errorData.message,
    icon: "warning"
  }).then(() => {
    $("#user-info").hide();
    $("#user-tabs, #forms, #right-column-title").show();
    $("#login.tab").tab("show");
  });
}

// sends search info to database for storage
function saveSearch() {

  const searchData = {
    location: $(this).attr("data-location")
  };
  console.log(searchData);

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return swal({
      title: "You must be logged in",
      icon: "error"
    });
  }

  $.ajax({
      url: "/api/search",
      method: "POST",
      data: searchData,
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
      handleError(err.responseJSON);
    });

}

// pulls all saved searches tied to an account
function getSearch() {

  $("#past-searches").empty();

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return swal({
      title: "You must be logged in",
      icon: "error"
    });
  }

  $.ajax({
      url: "/api/search",
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then(function (searchData) {
      console.log(searchData);
      for (var i = 0; i < searchData.searches.length; i++) {
        console.log("this runs!")
        console.log(searchData.searches[i].searchTerm)
        var searchBtn = $("<button>");
        searchBtn.text(searchData.searches[i].searchTerm)
          .attr("data-location", searchData.searches[i].searchTerm)
          .attr("class", "pastSearch btn btn-secondary m-2");
        $("#past-searches").append(searchBtn);
      }
    })
    .catch(function (err) {
      console.log(err);
      handleError(err.responseJSON);
    });
}

// on page load listeners and hides results fields
$(document).ready(function () {
  $("#user-info").hide();
  $("#results").hide();
  $("#signup-form").on("submit", signUp);
  $("#login-form").on("submit", login);
  $("#logout").on("click", logout);
  $("#save-search").on("click", saveSearch);
  $("#get-searches").on("click", getSearch);
  $("#flight-status-results").hide()

  const token = localStorage.getItem("accessToken");
  if (token) {
    getUserProfile();
  }
});

//translator section
$(document).on("click", "#translate-submit", function () {
  $("#translator-results").empty();


  var text = $("#text-input").val().trim().toLowerCase().replace(/ /g, "%20");
  var lang = $("#lang-input").val();

  var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190515T140015Z.469d4504237e43c4.5ad62c8589944f5eb4db838232d59b19a991dc73&text=" + text + "&lang=" + lang + "&options=1";

  console.log(text);
  console.log(lang);

  $.ajax({
    url: translateURL,
    method: "GET"
  }).then(function (response) {

    console.log(response.text[0]);
    var result = response.text[0];
    console.log(result);
    $("#translator-results").append(result);
  });
});


// listen for search form 
$("#search-form").on("submit", function (event) {
  event.preventDefault();
  var locationName = $("#location-input").val().trim();
  $("#save-search").attr("data-location", locationName);
  $("#results").show();
  $("#search").hide();
  console.log(locationName);
  $("#location-input").empty();
  $("#city-input").val(locationName);
  $("#destination").val(locationName)

});

$("#new-search").on("click", function () {
  $("#results").hide();
  $("#search").show();
})

// flight form listener
$(document).on("click", "#flight-submit", function () {

  var origin = $("#origin").val().trim().toLowerCase().replace(/ /g, "%20");
  var destination = $("#destination").val().trim().toLowerCase().replace(/ /g, "%20");
  var departDate = $("#depart-date").val();
  var cabin = $("#cabin").val();
  var adults = $("#adults").val();
  var bags = $("#bags").val();
  var flightURL = "https://apidojo-kayak-v1.p.rapidapi.com/flights/create-session?origin1=" + origin + "&destination1=" + destination + "&departdate1=" + departDate + "&cabin=" + cabin + "&currency=USD&adults=" + adults + "&bags=" + bags;

  console.log(flightURL);

  $.ajax({
      url: flightURL,
      headers: {
        'X-RapidAPI-Host': 'apidojo-kayak-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '84f14b8868msh3b8ceee7b583d2ep1998b9jsn3ec2ab651da9',
        'Content-Type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      data: String,
      success: function (data) {
        console.log('success: ' + data);
      }
    })
    .then(function (response) {
      console.log(response);
      
      //variables to append to page later
      var originCap = origin.toUpperCase().replace(/%20/g, " ");
      var destinationCap = destination.toUpperCase().replace(/%20/g, " ");
      var time = response.tripset[0].duration;
      var kayakURL = response.baseUrl;
      var flightShareURL = response.shareURL;
      var flightURL = kayakURL + flightShareURL;
     
      //create link to book flight
      var a = $('<a />');
      a.attr('href', flightURL);
      a.attr("target", "_blank");
      a.text("Book Now");

      function timeConvert(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + " hr : " + rminutes + " min.";
        }
      var convertedTime = timeConvert(time);
      console.log(convertedTime);

      //if-else statement for cheapest price
      var finalPrice;
      if (response.cheapestPrice < 0) {
        finalPrice = "Currency Exchange Error."
      } else {
        finalPrice = response.cheapestPrice;
      };

      var newRow = $("<tr>").append(
        $("<td>").text(originCap + " to " + destinationCap),
        $("<td>").text(response.departDate),
        $("<td>").text("$" + finalPrice),
        $("<td>").text(convertedTime),
        $('<td>').append(a)
      );

      $("#flight-table > tbody").append(newRow);
      $("#startDate").val(departDate);
    });
});

// event form listener
$(document).on("click", "#event-submit", function () {
  $("#event-results").empty();

  var city = $("#city-input").val().trim();
  var country = $("#countryInput").val();
  var startDate = $("#startDate").val();

  var eventUrl = "https://app.ticketmaster.com/discovery/v2/events?apikey=ziTAgm47Mj2vDUNxbkwubikfwa13WcR8&startDateTime=" + startDate + "T06:00:00Z&sort=date,asc&city=" + city + "&countryCode=" + country;

  $.ajax({
    url: eventUrl,
    method: "GET"
  }).then(function (response) {
    var results = response._embedded.events;
    console.log(results)
    for (var i = 0; i < results.length; i++) {
      var $div = $("<div>");
      var $h4 = $("<h4>").text(results[i].name);
      var $p = $("<p>").text(results[i].dates.start.localDate + " ");
      var $a = $("<a>").text("Ticket Link!")
        .attr("href", results[i].url)
        .attr("target", "_blank");
      $p.append($a)
      $div.append($h4, $p);
      $("#event-results").append($div);
    }
  });
})

// past search listener
$(document).on("click", ".pastSearch", function () {
  event.preventDefault();
  var pastLocation = $(this).attr("data-location")
  $("#search").hide();
  $("#results").show();
  $("#city-input").val(pastLocation);
  $("#destination").val(pastLocation);
})

$("#flight-status-submit").on("click",
function(){
  console.log("thisisclicked")
  $("#flight-status-results").show()
  $("#flight-status-results").empty();
  var carrier = $("#carrier-input").val();
  var flightNum = $("#flight-num-input").val();
  var flightDate = $("#flight-date").val().split("-").join("/");
  
  

 var flightStatusUrl = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/" + carrier + "/"+ flightNum + "/arr/" + flightDate + "?appId=81188cad&appKey=39caf475c4c198e8f70ec33023ecc538&utc=false"

 console.log(carrier,flightNum,flightDate);

 const apiQuery = `/api/search/flights?carrier=${carrier}&flightNum=${flightNum}&flightDate=${flightDate}`

  // /api/search/flights?carrier=

  $.ajax({
    url:apiQuery,
    method: "Get"
  }).then(function(response){
   
  $("#flight-status-results").append(
    $("<P>").text("Departure Date: " + response.flightStatuses[0].departureDate.dateLocal),
    $("<P>").text("Arrival Date: " + response.flightStatuses[0].arrivalDate.dateLocal),
    $("<P>").text("Scheduled Air Minutes: " + response.flightStatuses[0].flightDurations.scheduledAirMinutes),
    $("<P>").text("Departure Gate: " + response.flightStatuses[0].airportResources.departureGate),
    $("<P>").text("Arrival Terminal: " + response.flightStatuses[0].airportResources.arrivalTerminal),
    $("<P>").text("Arrival Gate: " +response.flightStatuses[0].airportResources.arrivalGate),
    $("<P>").text("Baggage: " + response.flightStatuses[0].airportResources.baggage),

  )
    
    
  }) 
})
