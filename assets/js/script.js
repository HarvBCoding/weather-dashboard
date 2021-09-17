const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
const city = document.querySelector('#searchTerm').value;
const todayEl = document.querySelector('#today');
const now = new Date();
function formatDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}


function displayCurrent(current) {
  let cityTitle = document.createElement("h3");
  cityTitle.setAttribute("class", "title");
  cityTitle.textContent = `${city} (${formatDate(now)})`;
  todayEl.appendChild(cityTitle);

  let weatherDetails = document.createElement("p")
  weatherDetails.setAttribute("class", "details")
  weatherDetails.textContent = 
    `Temp: ${current.temp}
    Wind: ${current.wind_speed}
    Humidity: ${current.humidity}
    UV Index: ${current.uvi}`
  cityTitle.appendChild(weatherDetails);

//Use jQuery to add to here:
// <section
   //           id="today"
     //       ></section>
}

function displayFiveDay(daily) {
//Use jQuery to add to here:
// <section
   //           id="forecast"
     //       ></section>
}

function saveToLocalState(city) {
    localStorage.setItem("city", city);
}

function searchCityWeather() {
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
  })
  .catch(function (error) {
    console.log(error)
  });
}