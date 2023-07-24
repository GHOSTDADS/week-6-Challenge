var currentCityEl= $('#current-city');
var searchHistroryEl= $("#search-history");
var currentDisplayEl = $('#currentDisplay');
var ForcastDisplayEl = $('#ForcastDisplay')
var APIKey = 'bdf3de5b1ec8cbb4eba643e01a2c54c2';
var city = '';
var displayIcon = $('#icon1');
var searchHistory = []
var unorderedListEL = $('#displayCurrent');

//code fore getting the city name from search.
function getLocation(city) { 
    var queryURLGeocode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city  + '&limit=5&appid=' + APIKey;

fetch(queryURLGeocode)
    .then(function (response){
        if (response.ok){
            return response.json();

        } else {
            throw response.json();
        }
    }).then(function (data) {
        if (!data.length){
            // console.log("oh no!!!")
        } else {
            console.log(data)
            var lat;
            var lon;
            lat = data[0].lat
            lon = data[0].lon;
            queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";
            var queryURLForecast = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&cnt=45&appid=" + APIKey + "&units=metric";
            weatherDisplay(queryURL);
            FiveDayWeather(queryURLForecast);
             }
    })
}

    function weatherDisplay(URL) {
        fetch(URL)
            .then(function (response){
                if (response.ok){
                    return response.json();
                } else {
                    throw response.json();
                }}
            ).then(function (data) {
                unorderedListEL.empty();
                var listElTemp = $('<li>').text("Temp: " + data.main.temp + "\u00B0C");
                listElTemp.addClass("list-group-item")
                var listElWind = $('<li>').text("Wind: " + data.wind.speed + " KMPH");
                listElWind.addClass("list-group-item")
                var listElHumid = $('<li>').text("Humidity: " + data.main.humidity + "\u0025");
                listElHumid.addClass("list-group-item")
                displayIcon.attr("src", "https://openweathermap.org/img/w/"+ data.weather[0].icon + ".png")
                currentCityEl.text(data.name);
                unorderedListEL.append(listElTemp, listElWind, listElHumid);
            })
    };


    function FiveDayWeather(URL) {
        fetch(URL)
        .then(function (response){
            if (response.ok){
                return response.json();
            } else {
                throw response.json();
            }})
            .then(function (data) {
                console.log(data);
                $('#ForcastDisplay').empty();
                for (var i = 0; i < 5; i++){

                        var forcastdiv = $('<div>')
                        forcastdiv.addClass("col-2 border border-2 m-2 bg-secondary")
                        var iconEl = $('<img>').attr("src", "https://openweathermap.org/img/w/"+ data.list[(i+(i*8))].weather[0].icon + ".png")
                        var forecastUL = $('<ul>').addClass("list-group list-group-flush col-3");
                        var listElTemp = $('<li>').text("Temp: " + data.list[(i+(i*8))].main.temp + "\u00B0C");
                        listElTemp.addClass("list-group-item bg-secondary");
                        var listElWind = $('<li>').text("Wind: " + data.list[(i+(i*8))].wind.speed + " KMPH");
                        listElWind.addClass("list-group-item bg-secondary");
                        var listElHumid = $('<li>').text("Humidity: " + data.list[(i+(i*8))].main.humidity + "\u0025");
                        listElHumid.addClass("list-group-item bg-secondary");
                        var date = dayjs.unix(data.list[(i+(i*8))].dt).format('D/MM/YYYY');
                        var dateEl = $('<li>').text(date);
                        dateEl.addClass("list-group-item bg-secondary");
                        forecastUL.append(dateEl, iconEl, listElTemp, listElWind, listElHumid);
                        forcastdiv.append(forecastUL);
                        ForcastDisplayEl.append(forcastdiv);
                    }
            })
    };

    $('.btn-submit').on("click", function (event) {
        event.preventDefault();
        city = $("#search-input").val();
        searchHistory.push(city);
        if (9 > searchHistory.length){
            searchHistroryEl.empty();
            for (i = 0; i < searchHistory.length; i++){
                var buttonEl = $('<button>').addClass('btn-history my-3 btn btn-light');
                buttonEl.text(searchHistory[i]);
                searchHistroryEl.append(buttonEl);
            }
        }
        getLocation(city);
    })

    $(searchHistroryEl).on("click", ".btn-history", function(event){
        event.preventDefault();
        var searchTerm = $(this).text();
        city = searchTerm;
        getLocation(city);
    })