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
    }).then(function (accessToken) {
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

function handleError(errorData) {
  swal({
    title: "Please login",
    text: errorData.message,
    icon: "warning"
  }).then(() => {
    $("#user-info").hide();
    $("#user-tabs, #forms, $#right-column-title").show();
    $("#login.tab").tab("show");
  });
}

$(document).ready(function () {
  $("#user-info").hide();
  $("#signup-form").on("submit", signUp);
  $("#login-form").on("submit", login);
  $("#logout").on("click", logout);

  const token = localStorage.getItem("accessToken");
  if (token) {
    getUserProfile();
  }
});

  
//translator section
$(document).on("click", "#translate-submit", function() {
  $("#translator-results").empty();
  

  var text = $("#text-input").val().trim().toLowerCase().replace(/ /g, "%20");
  var lang = $("#lang-input").val();

  var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190515T140015Z.469d4504237e43c4.5ad62c8589944f5eb4db838232d59b19a991dc73&text=" + text + "&lang=" + lang + "&options=1";
  
  console.log(text);
  console.log(lang);
  
  $.ajax({
    url: translateURL,
    method: "GET"
  }).then(function(response) {
    
    console.log(response.text[0]);
    var result = response.text[0];
    console.log(result);
    $("#translator-results").append(result);
  })

})