var APIKey = "8c893c4c32fcf3fcd766d09bdbea6d7c";
const dayContainer = $('div.fiveDay');
const uvIndexContainer = $('h6.uvIndex');
const zipCodeSearch = document.getElementById('searchText');
let townName = "";
const displayList = JSON.parse(localStorage.getItem("displayList")) || [{ town: "Boston", zip: "02108" }]; //if array is empty add Boston, so that the array doesn't load weird.
let zipCode = displayList[0].zip;
const recentSearches = document.getElementById('recentSearches');
const searchBtn = document.getElementById("search-btn");

zipCodeSearch.addEventListener("keyup", () => {
    searchBtn.disabled = !zipCodeSearch.value
});



function firstAjaxCall() {
    $.ajax({
        url: (`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${APIKey}`),
        method: "GET"
    })

    .then(function(response) {
        $(".cityCurrent").html(response.name + moment().format(' MMMM Do YYYY')); //add city and date

        const latitude = (response.coord.lat);
        const longitude = (response.coord.lon);
        const location = {
            latitude: latitude,
            longitude: longitude
        }
        secondAjaxCall(location);
        townName = response.name;
        saveRecentSearch();

    });
}
firstAjaxCall();

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    dayContainer.empty();
    zipCode = zipCodeSearch.value
    firstAjaxCall();
    zipCodeSearch.value = ""
});

function saveRecentSearch() {
    const recentSearch = {
        town: townName,
        zip: zipCode
    }

    displayList.unshift(recentSearch);
    displayList.splice(5);
    localStorage.setItem("displayList", JSON.stringify(displayList));
    printRecentSearch();
};

function secondAjaxCall(obj) {


    $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${obj.latitude}&lon=${obj.longitude}&appid=${APIKey}`,
            method: "GET"
        })
        .then(function(responsetwo) {

            var weatherImg = ("http://openweathermap.org/img/wn/" + responsetwo.current.weather[0].icon + "@2x.png")

            $(".cityCurrentSource").attr("src", weatherImg)
            $(".currentTempDisplay").html("Temperture: " + ((responsetwo.current.temp - 273) * 1.8 + 32).toFixed(2) + "°F")
            $(".currentHumidityDisplay").html("Humidity: " + responsetwo.current.humidity + "%")
            $(".currentwindspeedDisplay").html("Wind speed: " + responsetwo.current.wind_speed + "mph")
            let highlightColor = ''

            if (responsetwo.current.uvi < 3) {
                highlightColor = '#63a10d'
            } else if (responsetwo.current.uvi >= 3 && responsetwo.current.uvi < 6) {
                highlightColor = '#d4cd0b'
            } else if (responsetwo.current.uvi >= 6 && responsetwo.current.uvi < 8) {
                highlightColor = '#d4760b'
            } else if (responsetwo.current.uvi >= 8 && responsetwo.current.uvi < 11) {
                highlightColor = '#d40bc3'
            } else if (responsetwo.current.uvi > 11) {
                highlightColor = '#620bd4'
            } else {
                highlightColor = '#ffffff'
            };

            $(".uvIndex").html("UV Index: " + "<span style= background-color:" + highlightColor + '>' + responsetwo.current.uvi + "</span>");

            let i;
            for (i = 1; i < 6; i++) {
                var dateString = moment.unix(responsetwo.daily[i].dt).format("MM/DD/YYYY");

                const dayDiv = $('<div>').addClass('card text-white bg-info mb-3 fiveDayItem card');
                const dayCardBodyDiv = $('<div>').addClass('card-body');
                const date = $('<p>').addClass('bold card-title').text(dateString);
                const dayImg = $('<img>').attr('src', ("http://openweathermap.org/img/wn/" + responsetwo.daily[i].weather[0].icon + "@2x.png")).attr('alt', responsetwo.daily[i].weather[0].main).width('50%');
                const dayTemp = $('<p>').addClass('dayDisplay').text("Temp: " + ((responsetwo.daily[i].temp.day - 273) * 1.8 + 32).toFixed(2) + "°F");
                const dayHumidity = $('<p>').addClass('dayDisplay').text("Humidity:" + responsetwo.daily[i].humidity + "%");

                dayCardBodyDiv.append(date, dayImg, dayTemp, dayHumidity)
                dayDiv.append(dayCardBodyDiv)
                dayContainer.append(dayDiv)

            }


        });
}

function printRecentSearch() {
    recentSearches.innerHTML = ""
    displayList.map(displayList => {
        var li = document.createElement('li')
        li.innerHTML = displayList.town + " - " + displayList.zip
        recentSearches.appendChild(li)
    });
};