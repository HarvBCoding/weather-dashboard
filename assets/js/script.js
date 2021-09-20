const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
let city = document.querySelector('#searchTerm').value;
const todayEl = document.querySelector('#today');
const forecastEl = document.querySelector('#forecast');
const searchHistoryEl = document.querySelector('#history');
const now = new Date();
let cities = [];

function formatDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

function addDays(date, days) {
  let futureDays = new Date(date);
  futureDays.setDate(futureDays.getDate() + days);
  futureDays = formatDate(futureDays);
  return futureDays;
}


function displayCurrent(current) {
  todayEl.textContent = "";
  let cityTitle = document.createElement("h3");
  cityTitle.setAttribute("class", "title");
  cityTitle.textContent = `${city} (${formatDate(now)})`;
  todayEl.appendChild(cityTitle);

  let weatherDetails = document.createElement("p")
  weatherDetails.setAttribute("class", "details")
  weatherDetails.innerHTML = `<div> Temp: ${current.temp} °F </div> 
  <div>Wind: ${current.wind_speed} MPH </div> 
  <div>Humidity: ${current.humidity}% </div>
  <div>UV Index: <span>${current.uvi}</span> </div>`;

  cityTitle.appendChild(weatherDetails);

}

function displayFiveDay(daily) {
  const forecastTitle = document.querySelector('#forecastTitle') ;
  forecastTitle.textContent = "5-Day Forecast:"
  forecastEl.innerHTML = "";
  for  (let i = 1; i < 6; i++) {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card", "bg-primary");
    const cardHeader = document.createElement("h4");
    cardHeader.classList.add("card-title");
    cardHeader.textContent = addDays(now, i)

    const weatherIcon = document.createElement("img");
    const icon = daily[i].weather[0].icon
    weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${icon}.png`);

    const cardText = document.createElement("p");
    cardText.classList.add = "card-text";
    cardText.innerHTML = `<div> Temp: ${daily[i].temp.day} °F</div>
      <div> Wind: ${daily[i].wind_speed} MPH </div>
      <div> Humidity: ${daily[i].humidity}%`

    cardEl.appendChild(cardHeader)
    forecastEl.appendChild(cardEl)
    cardEl.appendChild(weatherIcon);
    cardEl.appendChild(cardText);
    
  }
}


function saveToLocalState(city) {
    cities.push(city);
    localStorage.setItem("city", JSON.stringify(cities));
}

function loadLocalStorage() {
  cities = JSON.parse(localStorage.getItem("city"))
  if (!cities) {
    cities = [];

  } else {

    for (let i = 0; i < cities.length; i++) {
      let citiesButton = document.createElement("button");
      citiesButton.textContent = cities[i];
      citiesButton.setAttribute("id", cities[i]);

      searchHistoryEl.appendChild(citiesButton);

    };
  };
}

loadLocalStorage()

function searchCityWeather() {
  
  city = document.querySelector('#searchTerm').value;
  fetch(`${weatherApiRootUrl}/geo/1.0/direct?q=${city}&limit=5&appid=${weatherApiKey}`)
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log('body', body);
    const lat = body[0].lat;
    const lon = body[0].lon;
    console.log(lat, lon);
    return fetch(`${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`)
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body)
    const current = body.current;
    const daily = body.daily;
    displayCurrent(current);
    displayFiveDay(daily);
    saveToLocalState(city);
    let newCitiesButton = document.createElement("button");
      newCitiesButton.textContent = city;
      newCitiesButton.setAttribute("id", city);

      searchHistoryEl.appendChild(newCitiesButton);
  })
  .catch(function (error) {
    console.log(error)
  });
}

$("#history").click(function() {
  let oldSearch = event.target.id
  city = oldSearch;
  searchCityWeather(city);
})