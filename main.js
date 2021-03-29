

// USER INPUT
const inputSection = document.querySelector('.input-header');
const input = document.querySelector('#input-field');
const inputBtn = document.querySelector('.button');
input.value = "";

// TEMPERATURA, UBICACIÓN Y TEMP MIN-MAX
const locationResults = document.querySelector('.results');
const currentTemp = document.querySelector('.current-temp');
const locationName = document.querySelector('.location-name');
const minSection = document.querySelector('.min');
const maxSection = document.querySelector('.max');

// WEATHER DETAILS
const feelsLike_element = document.querySelector('.feels-like');
const sky_element = document.querySelector('.sky');
const wind_element = document.querySelector('.wind');
const humidity_element = document.querySelector('.humidity');
const visibility_element = document.querySelector('.visibility');

// PRONÓSTICO DIA 1
const forecastDay1 = document.querySelector('.day1');
const forecastSky1 = document.querySelector('.sky-forecast1');
const forecastTemp1 = document.querySelector('.minmax-forecast1');
// PRONÓSTICO DIA 2
const forecastDay2 = document.querySelector('.day2');
const forecastSky2 = document.querySelector('.sky-forecast2');
const forecastTemp2 = document.querySelector('.minmax-forecast2');
// PRONÓSTICO DIA 3
const forecastDay3 = document.querySelector('.day3');
const forecastSky3 = document.querySelector('.sky-forecast3');
const forecastTemp3 = document.querySelector('.minmax-forecast3');

let ciudad = {city: [, []]}; // Variable donde se almacenan ciudades buscadas por el usuario
let intViewportHeight = window.innerHeight; // se almacena el height del viewport para controlar el overflow vertical
let weatherConditionIcon = document.getElementsByTagName('img'); // iconos que cambian según el clima.


// INICIO. LA PÁGINA PIDE UBICACIÓN AL USUARIO.
async function thisLocationWeather() {    
    let ubiData = await new Promise((res, rej) => {
        // getCurrentPosition: primer parametro es un callback para true, segundo callback es para false.
        navigator.geolocation.getCurrentPosition((locationData) => {
            let location = locationData.coords;
            res(location);

        }, (locationDenied) => {
            rej(locationDenied);
        }); 
    });
    
    let lat = ubiData.latitude;
    let lon = ubiData.longitude;
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=98f52917cd500fa8685f8b088d03de2c`   
    let response = await fetch(apiURL);
    let data = response.json();
    return data; // SI EL USER DIÓ ACCESO A SU UBICACIÓN, SE RETORNA LOS DATOS DE LA API
}

// Se llama a la función anterior para mostrar los datos en la página
thisLocationWeather()
.then(data => {
    let temp = data.current.temp; // temperatura actual
    let feelsLike = data.current.feels_like; // sensación térmica
    let sky = data.current.weather[0].description; // estado del cielo
    sky = sky.charAt(0).toUpperCase() + sky.substring(1); // primera letra en uppercase
    let humidity = data.current.humidity; // humedad
    let visibility = data.current.visibility; // visibilidad
    visibility /= 1000;

    // min-max temperature 
    // day 1 
    min1 = (data.daily[1].temp.min).toFixed();
    max1 = (data.daily[1].temp.max).toFixed();
    // day 2 
    min2 = (data.daily[2].temp.min).toFixed();
    max2 = (data.daily[2].temp.max).toFixed();
    // day 3 
    min3 = (data.daily[3].temp.min).toFixed();
    max3 = (data.daily[3].temp.max).toFixed();
    // temperatura de tres días
    forecastTemp1.textContent = `${min1} °C / ${max1} °C`;
    forecastTemp2.textContent = `${min2} °C / ${max2} °C`;
    forecastTemp3.textContent = `${min3} °C / ${max3} °C`;
    
    // estado del cielo, día 1
    skyState1 = data.daily[1].weather[0].description;
    // estado del cielo, día 2
    skyState2 = data.daily[2].weather[0].description;
    // estado del cielo, día 3
    skyState3 = data.daily[3].weather[0].description;
    // primera letra en uppercase
    skyState1 = skyState1[0].toUpperCase() + skyState1.substring(1);
    skyState2 = skyState2[0].toUpperCase() + skyState2.substring(1);
    skyState3 = skyState3[0].toUpperCase() + skyState3.substring(1);
    //estado del cielo de tres días
    forecastSky1.textContent = skyState1;
    forecastSky2.textContent = skyState2;
    forecastSky3.textContent = skyState3;

    // lógica para mostrar siempre los proximos tres días en el pronóstico
    let date = new Date();
    let day = date.getDay();
    let weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    forecastDay1.textContent = (weekDays[(day + 1) % 7]);
    forecastDay2.textContent = (weekDays[(day + 2) % 7]);
    forecastDay3.textContent = (weekDays[(day + 3) % 7]);
    
    // si el viewportHeight es menor a 731px activar overflow: auto.
    if (intViewportHeight < 731) {
        let body = document.querySelector('body');
        let htmlDoc = document.querySelector('html');
        body.style.overflow = 'auto';
        htmlDoc.style.overflow = 'auto';
    }

    // dependiendo del ID que retorna la api, mostrar un ícono ilustrativo del clima actual
    weatherConditionID = data.current.weather[0].id;
    if (weatherConditionID < 300) {
        weatherConditionIcon[0].setAttribute('src', 'assets/thunderstorm.svg');
    } else if (weatherConditionID < 400) {
        weatherConditionIcon[0].setAttribute('src', 'assets/drizzle.svg');
    } else if (weatherConditionID < 600) {
        weatherConditionIcon[0].setAttribute('src', 'assets/rain.svg');
    } else if (weatherConditionID < 700) {
        weatherConditionIcon[0].setAttribute('src', 'assets/snowflake.svg');
    } else if (weatherConditionID < 800) {
        weatherConditionIcon[0].setAttribute('src', 'assets/mist.svg');
    } else if (weatherConditionID === 800) {
        weatherConditionIcon[0].setAttribute('src', 'assets/sun.svg');
    } else if (weatherConditionID > 800) {
        weatherConditionIcon[0].setAttribute('src', 'assets/cloud.svg');
    };

    // Mostramos los datos en la página.
    currentTemp.textContent = `${temp} °C`;
    locationName.textContent = `Ubicación actual`;
    feelsLike_element.textContent = `Sensación térmica: ${feelsLike} °C`;
    sky_element.textContent = `Estado del cielo: ${sky}`;
    humidity_element.textContent = `Humedad: ${humidity}%`;
    visibility_element.textContent = `Visibilidad: ${visibility} km`;
    // transiciones hechas en css.
    inputSection.classList.add('animation');
    locationResults.classList.add('location-results-js');
})
.catch(err => {
    console.log(err);
});


// EL USUARIO BUSCA UNA UBICACIÓN (CIUDAD)
async function inputLocationWeather() {
    let locationSearched = input.value;
    if (!locationSearched.includes(",")) {
        alert('El formato de búsqueda es [ciudad, ID]')
    } else {
        let city = locationSearched.substring(0, locationSearched.indexOf(","));
        let countryCode = locationSearched.slice(-2);
        let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&lang=es&units=metric&appid=98f52917cd500fa8685f8b088d03de2c`;
        let response = await fetch(apiURL);
        let data = response.json();
        return data; // se retorna los datos de la API
    }
}

inputBtn.addEventListener('click', () => {
    inputLocationWeather() // la función async es llamada al efectuar la búsqueda haciendo click
    .then(data => {
        let temp = data.main.temp; // temperatura
        let cityName = data.name; // ciudad
        let feelsLike = data.main.feels_like; // sensación térmica
        let sky = data.weather[0].description; // estado del cielo
        sky = sky[0].toUpperCase() + sky.substring(1); // primera letra uppercase
        let humidity = data.main.humidity; // humedad
        let visibility = data.visibility; // visibilidad
        visibility /= 1000;

        input.value = "";

        // Se muestran los datos en la página
        currentTemp.textContent = `${temp} °C`;
        locationName.textContent = cityName;        
        feelsLike_element.textContent = `Sensación térmica: ${feelsLike} °C`;
        sky_element.textContent = `Estado del cielo: ${sky}`;
        humidity_element.textContent = `Humedad: ${humidity}%`;
        visibility_element.textContent = `Visibilidad: ${visibility} km`;

        // dependiendo del ID que retorna la api, mostrar un ícono ilustrativo del clima actual
        weatherConditionID = data.weather[0].id;
        if (weatherConditionID < 300) {
            weatherConditionIcon[0].setAttribute('src', 'assets/thunderstorm.svg');
        } else if (weatherConditionID < 400) {
            weatherConditionIcon[0].setAttribute('src', 'assets/drizzle.svg');
        } else if (weatherConditionID < 600) {
            weatherConditionIcon[0].setAttribute('src', 'assets/rain.svg');
        } else if (weatherConditionID < 700) {
            weatherConditionIcon[0].setAttribute('src', 'assets/snowflake.svg');
        } else if (weatherConditionID < 800) {
            weatherConditionIcon[0].setAttribute('src', 'assets/mist.svg');
        } else if (weatherConditionID === 800) {
            weatherConditionIcon[0].setAttribute('src', 'assets/sun.svg');
        } else if (weatherConditionID > 800) {
            weatherConditionIcon[0].setAttribute('src', 'assets/cloud.svg');
        };

        // Aquí hacemos uso del objeto llamado ciudad que declaramos al inicio.
        // 'ciudad' es el objeto. city es su única propiedad cuyo valor es un array. El index 0 de este array es el nombre de la ciudad buscada por el user. El index 1 de este array es otro array de dos indexes, siendo el primero la latitud y el segundo la longitud.
        ciudad.city[0] = data.name; // Se almacena en un objeto (ciudad) el nombre de la ciudad buscada previamente por el usuario
        lat = ciudad.city[1][0] = data.coord.lat;
        lon = ciudad.city[1][1] = data.coord.lon;


        // Esta funcion llama a la API utilizando las coordenadas almacenadas en el objeto 'ciudad'.
        async function dailyWeather() {
            let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=98f52917cd500fa8685f8b088d03de2c`;
            let response = await fetch(apiURL);
            let data = response.json();
            return data;
        }

        dailyWeather()
        .then(data => {
            // 3 day min-max temperature
            // day 1 
            min1 = (data.daily[1].temp.min).toFixed();
            max1 = (data.daily[1].temp.max).toFixed();
            // day 2 
            min2 = (data.daily[2].temp.min).toFixed();
            max2 = (data.daily[2].temp.max).toFixed();
            // day 3
            min3 = (data.daily[3].temp.min).toFixed();
            max3 = (data.daily[3].temp.max).toFixed();
            forecastTemp1.textContent = `${min1} °C / ${max1} °C`;
            forecastTemp2.textContent = `${min2} °C / ${max2} °C`;
            forecastTemp3.textContent = `${min3} °C / ${max3} °C`;
            
            // estado del cielo
            // día 1
            skyState1 = data.daily[1].weather[0].description;
            // día 2
            skyState2 = data.daily[2].weather[0].description;
            // día 3
            skyState3 = data.daily[3].weather[0].description;
            skyState1 = skyState1[0].toUpperCase() + skyState1.substring(1); // primera letra uppercase
            skyState2 = skyState2[0].toUpperCase() + skyState2.substring(1);
            skyState3 = skyState3[0].toUpperCase() + skyState3.substring(1);
            forecastSky1.textContent = skyState1;
            forecastSky2.textContent = skyState2;
            forecastSky3.textContent = skyState3;
            
            // tres próximos días en el pronóstico
            let date = new Date();
            let day = date.getDay();
            let weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            forecastDay1.textContent = (weekDays[(day + 1) % 7]);
            forecastDay2.textContent = (weekDays[(day + 2) % 7]);
            forecastDay3.textContent = (weekDays[(day + 3) % 7]);
 
            if (intViewportHeight < 731) {
                let body = document.querySelector('body');
                let htmlDoc = document.querySelector('html');
                body.style.overflow = 'auto';
                htmlDoc.style.overflow = 'auto';
            }
        })
        .catch(err => {
            console.log(err);
        });

        // transiciones hechas con CSS
        inputSection.classList.add('animation');
        locationResults.classList.add('location-results-js');
    })
    .catch(err => {
        console.log(err);
    });
});
