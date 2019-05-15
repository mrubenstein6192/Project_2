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
    location: $(this).attr("data-location")};
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
      for(var i = 0; i<searchData.searches.length; i++){
        console.log("this runs!")
        console.log(searchData.searches[i].searchTerm)
        var searchBtn = $("<button>");
        searchBtn.text(searchData.searches[i].searchTerm)
          .attr("data-location", searchData.searches[i].searchTerm);
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

$("#search-form").on("submit", function (event) {
  event.preventDefault();
  var locationName = $("#location-input").val().trim();
  $("#save-search").attr("data-location", locationName);
  $("#results").show();
  $("#search").hide();
  console.log(locationName);
  $("#location-input").empty();
});

$("#new-search").on("click", function () {
  $("#results").hide();
  $("#search").show();
})