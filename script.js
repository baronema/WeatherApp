$(document).ready(function() {
  // ================================================================
  // Get geolocation from browser
  // ================================================================
  if(navigator.geolocation) {
    
    navigator.geolocation.getCurrentPosition(function(position) {
      getWeatherByLoc(position.coords.latitude, position.coords.longitude);
      getLocation(position.coords.latitude, position.coords.longitude);
    }, function(err){$('#currentLoc').text("**Location Services are Disabled**");});
  } else {
    $('#currentLoc').text("Your browser doesn't support Geocoding!");
  } // end geolocation select
  
  //===================================================================
  // Local weather determined by Lat Long coords using Open Weather API
  // ==================================================================
  function getWeatherByLoc(lat, long){
    
    var api = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=imperial&appid=62f6a6565245f932fe24ec1d58d0a7d6';
    
    $.getJSON(api, function(data) {
      displayResults(data);
    }).fail(function() { 
      
      alert("***Your current location failed to return any results***"); 
    });
  } // end getWeatherByLoc()
  
  //=================================================================
  // Display current location using geocode data with Google Maps API
  // ================================================================
  function getLocation(lat, long){
    
    var api = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +',' + long + '&sensor=false';
    
    $.getJSON(api, function(data) {
      $('#currentLoc').text(data.results[1].formatted_address);
    }).fail(function() { 
      $("#currentLoc").text("**Google Maps API failed to retrieve address**"; 
    });
  } // end getLocation()
  
  // ===================================================================
  // Update all collected weather information 
  // ===================================================================
  function displayResults(data) {
    
    var icon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    $('#weather-icon').attr("src", icon);
    $('#location span').text(data.name);
    $('#celcius').removeClass('active');
    $('#fahrenheit').addClass('active');
    $('#weather-desc').text(data.weather[0].description);
    $('#temp-value span').text(Math.floor(data.main.temp));
    $('#wind').text(data.wind.speed);
    $('#hi_temp').text(Math.round(data.main.temp_max));
    $('#low_temp').text(Math.round(data.main.temp_min));
    $('#clouds').text(data.clouds.all);
    updateBackgroundImage(Math.floor(data.weather[0].id / 100));
  } // end displayResults()
  
  // ===================================================================
  // ===================================================================
  function updateLocation() {
    
  } // end updateLocation()
  
  // ===================================================================
  // Dynamic background dependent upon current weather forecast
  // ===================================================================
  function updateBackgroundImage(data) {
    var img, url;
    switch(data){
      case 2:
        img = "https://cdn.pixabay.com/photo/2017/08/03/08/51/zipper-2575090_1280.jpg";
        break;
      case 3:
        img = "https://cdn.pixabay.com/photo/2014/05/26/14/45/rain-354617_1280.jpg";
        break;
      case 5:
        img = "https://cdn.pixabay.com/photo/2014/04/05/11/39/rain-316579_1280.jpg";
        break;
      case 6:
        img = "https://cdn.pixabay.com/photo/2016/09/14/03/18/snow-1668695_1280.jpg";
        break;
      case 8:
        img = "https://cdn.pixabay.com/photo/2017/07/18/17/01/autumn-2516376_1280.jpg";
        break;
      default:
        img ="https://cdn.pixabay.com/photo/2015/04/07/15/04/weather-vane-711082_1280.jpg";
        break;
    }
    url = "url(" + img + ")";
    $('html').css('background-image', url);
  } // end updateBackgroundImage()
  
  // ==================================================================  
  // Event listener to toggle unit of measure between Imperial / Metric
  // ==================================================================
  $('#units').click(function(event) {
    
    var temp = $('#temp-value span').text(),
        hi = $('#hi_temp').text(),
        low = $('#low_temp').text(),
        speed = $('#wind').text();
    
    $('#celcius, #fahrenheit').removeClass('active');
    
    if(event.target.id == "celcius"){
      $('#temp-value span').text(convertFahToCel(temp));
      $('#hi_temp').text(convertFahToCel(hi));
      $('#low_temp').text(convertFahToCel(low));
      $('#wind').text(convert_MPH_MS(speed));
      $('#wind-unit').text("m/s");
      $('.unit').text("°C");
      $('#celcius').addClass('active');
    } else {
      $('#temp-value span').text(convertCelToFah(temp));
      $('#hi_temp').text(convertCelToFah(hi));
      $('#low_temp').text(convertCelToFah(low));
      $('#wind').text(convert_MS_MPH(speed));
      $('#fahrenheit').addClass('active');
      $('#wind-unit').text("mph");
      $('.unit').text("°F");
    }
  }); // end temp units click listener

  //================================================================
  // Click event listener to submit SEARCH by Zip
  // ===============================================================
  $('#search').click(function(event) {
    
    var zip = $('#zip').val();
    var api = 'https://api.openweathermap.org/data/2.5/weather?zip=' + zip + '&units=imperial&appid=62f6a6565245f932fe24ec1d58d0a7d6';
    
    $.getJSON(api, function(data) {
      displayResults(data);
    }).fail(function() { 
        alert("***Your Zip Code search failed to return any results, Try Again***"); 
    });
  }); // end search by zip click listener
    
  // ================================================================
  // Helper Functions 
  // ================================================================  
  function convertCelToFah(celcius) {
	  return Math.round(((celcius * 9) / 5) + 32);
  }

  function convertFahToCel(fahrenheit) {
	  return Math.round(((fahrenheit - 32) * 5) / 9);
  }
  
  function convert_MPH_MS(mph) {
	  return Number(((mph / 60) / 60) * 1610).toFixed(2);
  }
  
  function convert_MS_MPH(ms) {
	  return Number(((ms / 1610) * 60) * 60).toFixed(2);
  }
    
}); // end document ready
  