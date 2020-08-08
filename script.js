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