var unirest = require('unirest');

unirest.get("https://apidojo-kayak-v1.p.rapidapi.com/flights/create-session?origin1=SGN&destination1=DAD&departdate1=2018-12-20&cabin=e&currency=USD&adults=1&bags=0")
.header("X-RapidAPI-Host", "apidojo-kayak-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "e0e7edaa34msh620f3a2cd759863p15f7e7jsnf1810dcd367e")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});

var flightURL = "https://apidojo-kayak-v1.p.rapidapi.com/origin1=" + origin + "&destination1=" + destination + "&departdate1=" + departDate + "&cabin=" + cabin + "&currency=" + currency + "&adults=" + adults + "&bags=" + bags + "/api_key=e0e7edaa34msh620f3a2cd759863p15f7e7jsnf1810dcd367e";

$.ajax({
  url: flightURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
})