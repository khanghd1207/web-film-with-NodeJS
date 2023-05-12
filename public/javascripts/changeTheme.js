$(document).ready(function () {
  var checkBox = document.getElementById("cb");
  var theme = window.localStorage.getItem("data-theme");
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  checkBox.checked = theme == "dark" ? true : false;
  if(checkBox.checked){
    dark_mode();
  }
  else{
    light_mode();
  }
  checkBox.onchange = function () {
    if (checkBox.checked) {
      dark_mode();
    } else {
      light_mode();
    }
  };
  function dark_mode() {
    document.documentElement.setAttribute("data-theme", "dark");
    window.localStorage.setItem("data-theme", "dark");
    document.body.style.background = "rgb(33, 37, 41)";
    $("#navBar")
      .removeClass("navbar-light bg-light")
      .addClass("navbar-dark bg-dark");
    $("#THphim").css("color", "white");
    $("#films").css("color", "white");
    $("#boxComment").css("color", "white");
    $("#boxComment").css("background", "black");
    $("#footer").removeClass("bg-white").addClass("bg-dark");
    $(".detailsHome").css("color", "white");
  }
  function light_mode() {
    document.documentElement.setAttribute("data-theme", "light");
    window.localStorage.setItem("data-theme", "light");
    document.body.style.background = "rgb(248, 249, 250)";
    $("#navBar")
      .removeClass("navbar-dark bg-dark")
      .addClass("navbar-light bg-light");
    $("#THphim").css("color", "black");
    $("#films").css("color", "black");
    $("#boxComment").css("color", "black");
    $("#boxComment").css("background", "white");
    $("#footer").removeClass("bg-dark").addClass("bg-white");
    $(".detailsHome").css("color", "black");
  }
});