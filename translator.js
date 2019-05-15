var text = $("#text-input");

var lang = $("#lang-input");

var languages = ["Arabic", "Chinese", "Dutch", "French", "German", "Greek", "Hebrew", "Hindi", "Icelandic", "Indonesian", "Irish", "Italian", "Japanese", "Korean", "Latin", "Polish", "Portuguese", "Punjabi", "Russian", "Spanish", "Swahili", "Vietnamese"];

var langCodes = ["ar", "zh", "nl", "fr", "de", "el", "he", "hi", "is", "id", "ga", "it", "ja", "ko", "la", "pl", "pt", "pa", "ru", "es", "sw", "vi"];

// widget for translating whole page
{/* <div id="ytWidget"></div><script src="https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=en&widgetTheme=dark&autoMode=false" type="text/javascript"></script>
      </div> */

  

$(document).on("click", "translate-submit", function() {
  var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190515T140015Z.469d4504237e43c4.5ad62c8589944f5eb4db838232d59b19a991dc73&text=" + text + "&lang=" + lang + "&format=plain&options=1";
  
  var text = $("#text-input");
  var lang = $("#lang-input");

  $.ajax({
    url: translateURL,
    method: "GET"
  }).then(function(repsonse) {
    console.log(response);
  })
})