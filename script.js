const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.Search-btn')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')

const countrytext = document.querySelector('.country-txt')
const temptxt = document.querySelector('.temp-txt')
const conditiontxt = document.querySelector('.condition-txt')
const humidityvaluetxt = document.querySelector('.humidity-value-txt')
const windvaluetxt = document.querySelector('.wind-value-txt')
const weathersummaryimg = document.querySelector('.weahter-summary-img')
const currentdatetxt = document.querySelector('.current-date-txt')

const forecastitemscontainer =document.querySelector('.forecast-items-container')
const apiKey = '3cac1514fd9f0df6a15aca3ca02efd36'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() !== ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && cityInput.value.trim() !== ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}
function getweathericon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'

}
function getcurrentdate(){
    const currentdate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentdate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)
    if(weatherData.cod !== 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)
    

    const{
        name : country,
        main:{temp, humidity},
        weather:[{id, main}],
        wind: {speed}
    } = weatherData

    countrytext.textContent = country
    temptxt.textContent = Math.round(temp) + '°C'
    conditiontxt.textContent = main
    humidityvaluetxt.textContent = humidity + '%'
    windvaluetxt.textContent = speed + ' M/s'
    console.log(getcurrentdate())
    currentdatetxt.textContent = getcurrentdate()
    weathersummaryimg.src = `assets/weather/${getweathericon(id)}`

    await updateforecastinfo(city)
    showDisplaySection(weatherInfoSection) 

}
async function updateforecastinfo(city){
    const forecastdata = await getFetchData('forecast', city)
    const timetaken = '12:00:00'
    const todaydate = new Date().toISOString().split('T')[0]
    forecastitemscontainer.innerHTML = ''
    forecastdata.list.forEach(forecastweather =>{
        if(forecastweather.dt_txt.includes(timetaken) && ! forecastweather.dt_txt.includes(todaydate)){
            updateforecastitems(forecastweather)
        }
    } )
}
function updateforecastitems(weatherData){
    console.log(weatherData)
    const{
        dt_txt:date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const datetaken = new Date(date)
    const dateoption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = datetaken.toLocaleDateString('en-US', dateoption)
    const forecastitem = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getweathericon(id)}" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                </div>
                `

    forecastitemscontainer.insertAdjacentHTML('beforeend', forecastitem)
}

function showDisplaySection(sectionToShow){
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(sec => {
        sec.style.display = 'none'
    })
    sectionToShow.style.display = 'flex';

}
