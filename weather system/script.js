function showSidebar() {
    document.querySelector(".sidebar").style.display = 'block';
}

function hideSidebar() {
    document.querySelector(".sidebar").style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
    updateDateTime();
    getUserLocation();

    setInterval(updateDateTime, 1000); 
    setInterval(() => fetchWeatherData(currentCity), 300000); 
    setInterval(simulateWeatherChanges, 1000); 
});

let currentWeather = { temp: 25, feelsLike: 25, humidity: 50, windSpeed: 10, condition: "Clear" };
let displayedWeather = { ...currentWeather };
let currentCity = "Nairobi";


async function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                currentCity = await getCityName(latitude, longitude);
                displayLocation(currentCity);
                fetchWeatherData(currentCity);
            },
            async () => {
                await getIPLocation();
            }
        );
    } else {
        await getIPLocation();
    }
}


async function getCityName(lat, lon) {
    const apiKey = "5d959931579228785fc828e5c288430c";
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0]?.name || "Unknown Location";
    } catch {
        return "Unknown Location";
    }
}


async function getIPLocation() {
    try {
        const response = await fetch("https://ipinfo.io/json?token=YOUR_IPINFO_TOKEN");
        const data = await response.json();
        currentCity = data.city || "Nairobi";
        displayLocation(currentCity);
        fetchWeatherData(currentCity);
    } catch {
        currentCity = "Nairobi";
        displayLocation(currentCity);
        fetchWeatherData(currentCity);
    }
}


function displayLocation(city) {
    document.querySelector(".location").innerHTML = `<i class="fa-solid fa-location-dot" style="color:crimson;"></i> &nbsp; ${city}`;
}


function updateDateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    document.querySelector(".realTime").innerHTML = `
        ${formattedHours}:${minutes}:${seconds} 
        <span style="font-size: 3vw;">${amPm}</span>`;

    const days = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    document.querySelector(".date").innerHTML = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}th`;
}


async function fetchWeatherData(city) {
    const apiKey = "5d959931579228785fc828e5c288430c";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) return;

        currentWeather.temp = Math.round(data.main.temp);
        currentWeather.feelsLike = Math.round(data.main.feels_like);
        currentWeather.humidity = data.main.humidity;
        currentWeather.windSpeed = Math.round(data.wind.speed * 3.6); 
        currentWeather.condition = data.weather[0].main;

        updateWeatherUI();
    } catch {
        console.error("Failed to fetch weather data");
    }
}


function simulateWeatherChanges() {
    function fluctuate(value, min, max) {
        let change = Math.random() * 0.5 - 0.25; 
        let newValue = value + change;
        return Math.max(min, Math.min(max, newValue.toFixed(1)));
    }

    displayedWeather.temp = fluctuate(displayedWeather.temp, currentWeather.temp - 2, currentWeather.temp + 2);
    displayedWeather.feelsLike = fluctuate(displayedWeather.feelsLike, currentWeather.feelsLike - 2, currentWeather.feelsLike + 2);
    displayedWeather.humidity = fluctuate(displayedWeather.humidity, currentWeather.humidity - 3, currentWeather.humidity + 3);
    displayedWeather.windSpeed = fluctuate(displayedWeather.windSpeed, currentWeather.windSpeed - 1, currentWeather.windSpeed + 1);

    updateWeatherUI();
}


function updateWeatherUI() {
    document.querySelector(".two h3").innerHTML = `+${displayedWeather.temp}&deg;C`;
    document.querySelector(".three").innerHTML = `
        <p>RealFeel ${displayedWeather.feelsLike}&deg;C</p>
        <p>Humidity ${displayedWeather.humidity}%</p>
        <p>Wind ${displayedWeather.windSpeed} km/h</p>
    `;

    document.querySelector(".one i").className = `fa-solid ${getWeatherIcon(currentWeather.condition)}`;
    document.querySelector(".one p").textContent = currentWeather.condition;
}


function getWeatherIcon(condition) {
    const icons = {
        Clear: "fa-sun",
        Clouds: "fa-cloud",
        Rain: "fa-cloud-showers-water",
        Drizzle: "fa-cloud-rain",
        Thunderstorm: "fa-bolt",
        Snow: "fa-snowflake",
        Mist: "fa-smog"
    };
    return icons[condition] || "fa-cloud";
}

function toggleSettingsDropdown() {
    document.querySelector('.settings-dropdown').classList.toggle('active');
  }
  
  function toggleDarkMode() {
    document.body.style.background = "black";
    document.body.style.color = "white";
  }
  
  function toggleLightMode() {
    document.body.style.background = "#999";
    document.body.style.color = "black";
    
  }
  
  
  document.addEventListener("click", function (event) {
    let dropdown = document.querySelector(".settings-dropdown");
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("active");
    }
  });
  function resetToDefault() {
    document.body.style.background = "";
    document.body.style.color = "";
  }
  
  
  document.addEventListener("click", function (event) {
    let dropdown = document.querySelector(".settings-dropdown");
    
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("active");
      resetToDefault();
    }
  });
  
