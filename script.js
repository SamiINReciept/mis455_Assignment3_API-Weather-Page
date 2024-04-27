var lat = 0;
var lon = 0;
var flag = 0;
var countryName = 0;
var capital = 0;
var language = 0;
var pop = 0;
var continent = 0
var currency = 0;
var timezone = 0;
var map  = 0;

// Hides hero and activates all else (div)
function showDiv() {
    const divs = document.querySelectorAll('div');
    
    divs.forEach(div => {
        if (!div.classList.contains("infoRows")) { 
            div.classList.remove('hidden');
        }
    });
    
    var hero = document.getElementById("hero");
    hero.style.display = "none";
}

// For fetching relevant data of a country
function connect_country(){
    var name = document.getElementById("countryName").value;
    document.getElementById("countryName").value = "";
    var url = `https://restcountries.com/v3.1/name/${name}`;

    var infoCards = document.getElementById("infoCards");
    infoCards.classList.add("hidden");
    showDiv();
    
    fetch(url)
    .then(res => res.json())
    .then(data => display(data[0]));
}

// For fetching current weather
function connect_current_weather(){
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=04e7e56c742577cd8197f6f1f8b1cb31&units=metric`;
    
    fetch(url)
    .then(res => res.json())
    .then(data => currentWeather(data));
}

// For fetching 5-day forecasted weather
function connect_forecast_weather(){
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=04e7e56c742577cd8197f6f1f8b1cb31&units=metric`;
    
    fetch(url)
    .then(res => res.json())
    .then(data => forecastWeather(data));
}

// For displaying flag and inforows class
function display(data){
    lat = data.latlng[0];
    lon = data.latlng[1];

    // Uses the lat lon to fetch current weather info and display it
    connect_current_weather();
    // Uses the lat lon to fetch 5-day forecasted weather info and display it
    connect_forecast_weather();

    flag = data.flags.png;
    countryName = data.name.common;
    capital = data.capital[0];

    // Gets the Language
    var langArr = data.languages;
    var languageList = [];

    for(const lang in langArr){
        languageList.push(langArr[lang]);
    }
    language = languageList.join(", "); 

    pop = (data.population).toLocaleString();
    continent = data.continents[0]
    
    // Gets the Currency
    var currArr = data.currencies;
    var key = Object.keys(currArr)[0]
    currency = `${currArr[key].name} ${currArr[key].symbol}`;
    
    // Gets the Timezones
    var timeArr = data.timezones;
    var keys = Object.keys(timeArr)
    var timezonesArr = [];
    for (const key in keys){
        timezonesArr.push(timeArr[key]);
    }
    timezone = timezonesArr.join(", ");
    
    // Gets the Map link
    map  = data.maps.googleMaps;
    var flagCard = document.getElementById("flagCard");

    flagCard.innerHTML = `
                     <div class="flag">
                        <img src="${flag}" alt="" height="280px" width="480">
                     </div>
                    
                     <div class="details">
                        <div class="name">${countryName}</div>
                        <div class="cap-details">
                            <div class="cap">Capital: ${capital}</div>
                            <button onclick="showDetails()" id="details">More Details</button>
                        </div>
                     </div>
                    `;
}

// For displaying the infoRows cards
function showDetails(){
    var infoCards = document.getElementById("infoCards");
    infoCards.classList.remove("hidden");

    infoCards.innerHTML = `
                            <div class="info1 innerGrid">
                                <div class="label">
                                    Language
                                </div>
                                <div class="value">
                                    ${language}
                                </div>
                            </div>
                            <div class="info2 innerGrid">
                                <div class="label">
                                    Population
                                </div>
                                <div class="value">
                                    ${pop}
                                </div>
                            </div>
                            <div class="info3 innerGrid">
                                <div class="label">
                                    Continent
                                </div>
                                <div class="value">
                                    ${continent}
                                </div>
                            </div>
                            <div class="info4 innerGrid">
                                <div class="label">
                                    Currency
                                </div>
                                <div class="value">
                                    ${currency}
                                </div>
                            </div>
                            <div class="info5 innerGrid">
                                <div class="label">
                                    Timezone
                                </div>
                                <div class="value">
                                    ${timezone}
                                </div>
                            </div>
                            <div class="info6 innerGrid">
                                <div class="label">
                                    Maps
                                </div>
                                <div class="value">
                                    <a href="${map}" class="maplink">Google Maps</a>
                                </div>
                            </div>
    `;
}

// For formatting current date
function addOrdinalSuffix(date) {
    const suffixes = ["th", "st", "nd", "rd"];
    const day = date % 10;
    return date + (suffixes[(date % 100 - 20) % 10] || suffixes[day] || suffixes[0]);
}

var date = 0;
var currentTemp = 0;
// For displaying current weather in Temperature Card
function currentWeather(data){
    // Current Temp rounded to 1 decimal place
    currentTemp = data.main.temp;
    currentTemp = currentTemp.toFixed(1);
    if (Number.isInteger(parseFloat(currentTemp))) {
        currentTemp = parseInt(currentTemp);
    }

    // Current date in 24th April, 2024 format
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const formattedDate = addOrdinalSuffix(currentDate.getDate());
    date = `${formattedDate} ${currentMonth}, ${currentYear}`;
    
    var tempCard = document.getElementById("TemperatureCard");
    tempCard.innerHTML = `  <div class="temp">
                                ${currentTemp} C
                            </div>

                            <div class="date">
                                <img src="Images/black_calendar_app_icon__-removebg-preview.png" alt="" height="48px" width="48px">
                                <div id="dateItem">${date}</div>
                            </div>

                            <div class="location">
                                <img src="Images/Location_Icon_Vector_Hd_Images__Vector_Location_Icon__Location_Icons__Location_Icon__Map_PNG_Image_For_Free_Download-removebg-preview.png" alt="" height="47px" width="47px">
                                <div id="countryItem">${countryName}</div>
                            </div>
    `;
}

// For displaying forecast weather in Temperature Card
function forecastWeather(data){
    // Get the last entry from the list
    const lastEntry = data.list[data.list.length - 1];

    // Extract the hour from the dt_txt field of the last entry
    const lastEntryHour = new Date(lastEntry.dt_txt.replace(/-/g, '/')).getHours();

    // Filter the list array to include only the data for the last entry hour of each day for the next 5 days (skipping the current date)
    const nextFiveDaysData = data.list.filter(item => {
        // Extract the date and hour from dt_txt field
        const date = new Date(item.dt_txt.replace(/-/g, '/'));
        const hour = date.getHours();

        // Check if it's the last entry hour and skip the current date's data
        return hour === lastEntryHour && date.getDate() !== new Date().getDate();
    }).slice(0, 5);

    // Extract the daytime temperature for each day
    const daytimeTemps = nextFiveDaysData.map(item => item.main.temp);

    var forecastedTemps = daytimeTemps.map(temp => {
        let currentTemp = temp.toFixed(1);
        if (Number.isInteger(parseFloat(currentTemp))) {
            currentTemp = parseInt(currentTemp);
        }
        return currentTemp;
    });

    const currentDate = new Date();

    // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const currentDayOfWeek = currentDate.getDay();

    // Array of day names
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Generate names of next 5 days
    const nextFiveDaysNames = [];
    for (let i = 1; i <= 5; i++) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + i);
        nextFiveDaysNames.push(dayNames[nextDate.getDay()]);
    }

    var forecastCard = document.getElementById("forecastCard");
    forecastCard.innerHTML = `
                            <div class="today grid-item">Today</div>
                            <div class="todayTemp grid-item">${currentTemp} C</div>
                            <div class="dayplus1 grid-item">${nextFiveDaysNames[0]}</div>
                            <div class="degreeplus1 grid-item">${forecastedTemps[0]} C</div>
                            <div class="dayplus2 grid-item">${nextFiveDaysNames[1]}</div>
                            <div class="degreeplus2 grid-item">${forecastedTemps[1]} C</div>
                            <div class="dayplus3 grid-item">${nextFiveDaysNames[2]}</div>
                            <div class="degreeplus3 grid-item">${forecastedTemps[2]} C</div>
                            <div class="dayplus4 grid-item">${nextFiveDaysNames[3]}</div>
                            <div class="degreeplus4 grid-item">${forecastedTemps[3]} C</div>
                            <div class="dayplus5 grid-item-spec">${nextFiveDaysNames[4]}</div>
                            <div class="degreeplus5 grid-item-spec">${forecastedTemps[4]} C</div>
    `;
}
