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
      console.log(userData);
      $("#user-tabs, #forms, #right-column-title").hide();
      $("#user-info").show();
      $("#full-name").text(userData.fullName);
    })
    .catch(err => {
      console.log(err);
      handleError(err.responseJSON);
    });
}

function logout() {
  localStorage.removeItem('accessToken');
  $("#user-info").hide();
  $("#user-tabs, #forms, #rigth-column-title").show();
  $("#login").tab("show");
}

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
      $("#user-tabs, #forms, #right-column-title").hide();
      $("#user-info").show();
      $("#full-name").text(userData.fullName);
    })
    .catch(err => {
      console.log(err);
      handleError(err.responseJSON);
    });
}

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

function getSearch() {
  

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
          .attr("class", "pastSearch" );
        $("#past-searches").append(searchBtn);
      }
    })
    .catch(function (err) {
      console.log(err);
      handleError(err.responseJSON);
    });
}


$(document).ready(function () {
  $("#user-info").hide();
  $("#results").hide();
  $("#signup-form").on("submit", signUp);
  $("#login-form").on("submit", login);
  $("#logout").on("click", logout);
  $("#save-search").on("click", saveSearch);
  $("#get-searches").on("click", getSearch);

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
  })
})

$("#search-form").on("submit", function (event) {
  event.preventDefault();
  var locationName = $("#location-input").val().trim();
  $("#save-search").attr("data-location", locationName);
  $("#results").show();
  $("#search").hide();
  console.log(locationName);
  $("#location-input").empty();
  $("#city-input").val(locationName);
});

$("#new-search").on("click", function () {
  $("#results").hide();
  $("#search").show();
})

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

$(document).on("click", ".pastSearch", function(){
  event.preventDefault();
  var pastLocation = $(this).attr("data-location")
  $("#search").hide();  
  $("#results").show();
  $("#city-input").val(pastLocation);
})