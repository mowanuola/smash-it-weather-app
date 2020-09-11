const API_KEY = "0d37655683c5cf1ae62b12fee38a3ed5";
const CELSIUS = 273.15;
let URL = "https://api.openweathermap.org/";
let loading = false;
let city;
let latest_search = document.getElementById("latest_search");
let success = "Yaay! Perfect Weather. The event will hold 💃🏾";
let probably = "Guess we might have the event  🤞🏽";
let failed = "Oh no! The event will not hold 🙅🏽‍♀️";
let cityName = document.getElementById("city");
let datetime = document.getElementById("datetime");
let temp = document.querySelectorAll(".temp");
let season = document.getElementById("season");
let w_alert = document.getElementById("alert");
let humid = document.getElementById("humid");
let w_icon = document.getElementById("w_icon");

const checkLoad = (id) => {
  if (loading) {
    document.getElementById(id).className += " d-block";
  } else if (!loading) {
    document.getElementById(id).classList.remove("d-block");
  }
};

const fetchWeather = (city_name, lat = 0, lon = 0) => {
  loading = true;
  checkLoad("cover-spin");
  let url;
  if (lat != 0 && lon != 0) {
    url = URL + `data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  } else {
    url = URL + `data/2.5/weather?q=${city_name}&appid=${API_KEY}`;
  }

  fetch(url)
    .then((res) => {
      res
        .json()
        .then((data) => {
          let city_res = JSON.stringify(data);
          let val;
          if (lon !== 0 && lat !== 0) {
            val = `${lon.toFixed(2)} Longitude ${lat.toFixed(2)} Latitude`;
          } else {
            val = city_name;
          }
          loading = false;
          checkLoad("cover-spin");
          latestSearchResults();
          localStorage.setItem(`${val}`, city_res);
          formatResponse(data);
        })
        .catch((err) => {
          alert("Error Occurred!!!");
        });
    })
    .catch((err) => {
      alert("Error Occurred!!! Please check connection and try again");
    });
};
const formatResponse = (data) => {
  let newTemp = getTemp(data.main.temp);
  cityName.innerHTML = `<h4>${data.name}</h4>`;
  datetime.innerHTML = new Date(data.dt * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  temp[0].innerHTML = `<h4>${newTemp.celsius.toFixed(0)}&degC</h4>`;
  temp[1].innerHTML = `${newTemp.celsius.toFixed(0)}&degC`;
  humid.innerHTML = `${data.main.humidity}%`;
  season.innerHTML = data.weather[0].main;
  getIcon(data.weather[0].icon);
  addAlert(data.weather[0].main);
};

const onSubmit = () => {
  city = document.getElementById("city-name").value;
  fetchWeather(city);
  latestSearchResults();
};

const onLoad = () => {
  city = document.getElementById("city-name").value = "New York";
  getLocation(city);
  latestSearchResults();
};
function getTemp(degreeKelv) {
  let celsius = degreeKelv - CELSIUS;
  let farenheit = celsius * (9 / 5) + 32;
  return { celsius, farenheit };
}
const getIcon = (id) => {
  let url = `https://openweathermap.org/img/wn/${id}@2x.png`;
  w_icon.src = url;
};
const getLocation = (city_name) => {
  loading = true;
  fetchWeather(city_name);
  checkLoad("cover-spin");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
};
const successCallback = (position) => {
  city = document.getElementById("city-name").value = "";
  fetchWeather(city, position.coords.latitude, position.coords.longitude);
};
const errorCallback = (error) => {
  if (error) {
    city = document.getElementById("city-name").value = "New York";
    fetchWeather(city);
  }
};
const addAlert = (season) => {
  if (
    season == "Thunderstorm" ||
    season == "Rain" ||
    season == "Snow" ||
    season == "Tornado" ||
    season == "Ash" ||
    season == "Sand" ||
    season == "Squall" ||
    season == "Smoke"
  ) {
    w_alert.innerHTML = failed;
  } else if (
    season == "Dust" ||
    season == "Fog" ||
    season == "Haze" ||
    season == "Drizzle"
  ) {
    w_alert.innerHTML = probably;
  } else if (season == "Clouds" || season == "Clear") {
    w_alert.innerHTML = success;
  } else {
    w_alert.innerHTML = probably;
  }
};

function latestSearchResults() {
  const search = (city_name, datetime, lat = 0, lon = 0) => {
    let val;
    if (lon !== 0 && lat !== 0) {
      val = `${lon.toFixed(2)} Longitude, ${lat.toFixed(2)} Latitude`;
    } else {
      val = city_name;
    }
    return `
		<div class="search">
			<div>
        <h5 id="search-city">${val}</h5>
        </div>
        <div class="row m-auto"> 
				<p id="search-time">${datetime}</p>
			
      <a href="#" class="del" >
      <i class="far fa-trash-alt pl-3 icon" height="25" for="${val}"></i>
      </a>
      </div>
		</div>
	`;
  };
  let length = localStorage.length;
  if (length) {
    document.getElementById("search_results").style.display = "block";
    latest_search.innerHTML = null;
    Object.keys(localStorage).forEach((city) => {
      let get_city = localStorage.getItem(`${city}`);
      let { dt } = JSON.parse(get_city);
      let date = new Date(dt * 1000).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      latest_search.insertAdjacentHTML("afterbegin", search(city, date));
    });

    document.querySelectorAll(".del").forEach((elem) => {
      elem.addEventListener("click", (i) => {
        let city = event.target.getAttribute("for");
        deleteCity(city).then(() => latestSearchResults());
      });
    });
  } else {
    latest_search.innerHTML = "<small>You have no search history</small>";
  }
}

const deleteCity = async (city) => {
  localStorage.removeItem(`${city}`);
};

const checkLocalStorage = () => {};

onLoad();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
