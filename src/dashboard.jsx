import sunnyDay from './assets/day_sunny.png';
import notSunnyDay from './assets/day_notSunny.png';
import heavyRainDay from './assets/day_heavyRain.png';
import lightRainDay from './assets/day_lightRain.png';
import heavySnowDay from './assets/sunny_heavySnow.png';
import lightSnowDay from './assets/sunny_lightSnow.png';
import eveningTime from './assets/evening_time.png';
import eveningRain from './assets/evening_rain.png';
import heavySnowEvn from './assets/notSunny_heavySnow.png';
import lightSnowEvn from './assets/notSunny_lightSnow.png';
import nightTime from './assets/night_time.png';
import heavyRainNight from './assets/night_heavyRain.png';
import lightRainNight from './assets/night_lightRain.png';
import heavySnowNight from './assets/night_heavySnow.png';
import lightSnowNight from './assets/night_lightSnow.png';
import { ResultsModal, SearchCont, validateInput, startSearch, search, updateStates } from './search.jsx';
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import './dashboard.css'

let pageHeight;
function WeatherDashboard() {
  const [dashSearchedState, setDashSearchedState] = useState('not-searched');
  const [dashNoteState, setDashNoteState] = useState('no-note');
  const [dashModalStatus, setDashModalStatus] = useState('loading');
  const [loadingStatus, setLoadingStatus] = useState('locations-loading');
  const [validState, setValidationState] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLocationObj, weatherDataObj] = location.state || {};
  const [weatherData, setWeatherData] = useState(location.state ? weatherDataObj : {});
  const [selectedLocation, setSelectedLocation] = useState(location.state ? selectedLocationObj : {});
  const { weather_code: weatherCode } = weatherData.current;
  const { time: responseDate } = weatherData.current;
  const currentHour = Number(responseDate.substring(11, 13));
  let timeOfTheDay = '';
  if (currentHour >= 7 && currentHour < 9) {
    timeOfTheDay = 'early-morning';
  } else if (currentHour >= 9 && currentHour < 17) {
    timeOfTheDay = 'morning-afternoon';
  } else  if (currentHour >= 17 && currentHour < 19) {
    timeOfTheDay = 'evening';
  } else {
    timeOfTheDay = 'night-midnt';
  }

  useEffect(() => {
    const loadNote = () => {
      // setTimeout(() => {
      //   setDashNoteState('note');
      // }, 5000);
    }
    document.onload = loadNote();
    return () => document.removeEventListener('load', loadNote);
  }, [])
  useEffect(() => {
    const resetPageHeight = () => {
      pageHeight = (Number.parseInt(document.documentElement.scrollHeight) + 15).toString();
    }
    document.onload = resetPageHeight();
    return () => document.removeEventListener('load', resetPageHeight);
  }, [pageHeight])
  useEffect(() => {
    const loadBackground = () => {
      if (timeOfTheDay === 'early-morning') {
        if ([51, 53, 55, 56, 57].includes(weatherCode) || weatherCode === 61 || weatherCode === 63 || weatherCode === 66 || weatherCode === 80 || weatherCode === 81) {
          return setTimeOfDay('light-rain-evn');
        } else if (weatherCode === 65 || weatherCode === 67 || weatherCode === 82 || [95, 96, 99].includes(weatherCode)) {
          return setTimeOfDay('heavy-rain-day');
        } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 77 || weatherCode === 85) {
          return setTimeOfDay('light-snow-evn');
        } else if (weatherCode === 75 || weatherCode === 86) {
          return setTimeOfDay('heavy-snow-evn');
        }
        return setTimeOfDay('early-mrn');
      } else if (timeOfTheDay === 'morning-afternoon') {
        if (weatherCode === 0 || weatherCode === 1) {
          return setTimeOfDay('sunny-day');
        } else if (weatherCode === 2 || weatherCode === 3) {
          return setTimeOfDay('not-sunny-day');
        } else if ([51, 53, 55, 56, 57].includes(weatherCode) || weatherCode === 61 || weatherCode === 63 || weatherCode === 66 || weatherCode === 80 || weatherCode === 81) {
          return setTimeOfDay('light-rain-day');
        } else if (weatherCode === 65 || weatherCode === 67 || weatherCode === 82 || [95, 96, 97, 99].includes(weatherCode)) {
          return setTimeOfDay('heavy-rain-day');
        } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 77 || weatherCode === 85) {
          return setTimeOfDay('light-snow-day');
        } else if (weatherCode === 75 || weatherCode === 86) {
          return setTimeOfDay('heavy-snow-day');
        }
      } else if (timeOfTheDay === 'evening') {
        if ([51, 53, 55, 56, 57].includes(weatherCode) || weatherCode === 61 || weatherCode === 63 || weatherCode === 66 || weatherCode === 80 || weatherCode === 81) {
          return setTimeOfDay('light-rain-evn');
        } else if (weatherCode === 65 || weatherCode === 67 || weatherCode === 82 || [95, 96, 99].includes(weatherCode)) {
          return setTimeOfDay('heavy-rain-day');
        } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 77 || weatherCode === 85) {
          return setTimeOfDay('light-snow-evn');
        } else if (weatherCode === 75 || weatherCode === 86) {
          return setTimeOfDay('heavy-snow-evn');
        }
        return setTimeOfDay('evening');
      } else if (timeOfTheDay === 'night-midnt') {
        if ([51, 53, 55, 56, 57].includes(weatherCode) || weatherCode === 61 || weatherCode === 63 || weatherCode === 66 || weatherCode === 80 || weatherCode === 81) {
          return setTimeOfDay('light-rain-night');
        } else if (weatherCode === 65 || weatherCode === 67 || weatherCode === 82 || [95, 96, 99].includes(weatherCode)) {
          return setTimeOfDay('heavy-rain-night');
        } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 77 || weatherCode === 85) {
          return setTimeOfDay('light-snow-night');
        } else if (weatherCode === 75 || weatherCode === 86) {
          return setTimeOfDay('heavy-snow-night');
        }
        return setTimeOfDay('night');
      }
    }
    document.onload = loadBackground();
    return () => document.removeEventListener('load', loadBackground);
  }, [timeOfTheDay, weatherCode]);
  return (
    <div id='outer-background' style={{height: pageHeight + 'px'}}>
      <div id="background" style={{
        backgroundImage: `url(${
          timeOfDay === 'early-mrn' ? eveningTime : 
          timeOfDay === 'sunny-day' ? sunnyDay : 
          timeOfDay === 'not-sunny-day' ? notSunnyDay : 
          timeOfDay === 'light-rain-day' ? lightRainDay : 
          timeOfDay === 'heavy-rain-day' ? heavyRainDay : 
          timeOfDay === 'light-snow-day' ? lightSnowDay : 
          timeOfDay === 'heavy-snow-day' ? heavySnowDay : 
          timeOfDay === 'evening' ? eveningTime : 
          timeOfDay === 'light-rain-evn' ? eveningRain : 
          timeOfDay === 'light-snow-evn' ? lightSnowEvn : 
          timeOfDay === 'heavy-snow-evn' ? heavySnowEvn : 
          timeOfDay === 'light-rain-night' ? lightRainNight : 
          timeOfDay === 'heavy-rain-night' ? heavyRainNight : 
          timeOfDay === 'light-snow-night' ? lightSnowNight : 
          timeOfDay === 'heavy-snow-night' ? heavySnowNight : 
          timeOfDay === 'night' ? nightTime : '' })`
        }
        }>
        {timeOfDay === 'early-mrn' && <div id='overlay-evn'></div>}
        {timeOfDay === 'sunny-day' && <div id='overlay-sunny'></div>}
        {timeOfDay === 'not-sunny-day' && <div id='overlay-not-sunny'></div>}
        {timeOfDay === 'light-rain-day' && <div id='overlay-evn'></div>}
        {timeOfDay === 'heavy-rain-day' && <div id='overlay-evn'></div>}
        {timeOfDay === 'light-snow-day' && <div id='overlay-sunny'></div>}
        {timeOfDay === 'heavy-snow-day' && <div id='overlay-sunny'></div>}
        {timeOfDay === 'evening' && <div id='overlay-evn'></div>}
        {timeOfDay === 'light-snow-evn' && <div id='overlay-notSunny'></div>}
        {timeOfDay === 'heavy-snow-evn' && <div id='overlay-notSunny'></div>}
        {dashNoteState === 'note' && <NoteModal noteStateSetter={setDashNoteState} />}
        {dashSearchedState === 'searched' && <ResultsModal searchStateSetter={setDashSearchedState} searchedState={dashSearchedState} statusState={dashModalStatus} statusStateSetter={setDashModalStatus} 
          loadingStatus={loadingStatus} loadingStatusStateSetter={setLoadingStatus} weatherDataSetter={setWeatherData} selectedLocationSetter={setSelectedLocation} />}
        {dashSearchedState === 'reloading' && <ReloadingOverlay />}
        <Header validStateSetter={setValidationState} searchStateSetter={setDashSearchedState} selectedLocation={selectedLocation} weatherDataSetter={setWeatherData} 
        statusStateSetter={setDashModalStatus} validState={validState} dashSearchedState={dashSearchedState} navigate={navigate} />
        <WeatherSummary selectedLocation={selectedLocation} weatherData={weatherData} />
        <InfoCard selectedLocation={selectedLocation} weatherData={weatherData} />
      </div>
    </div>
  ) 
}
async function updateWeatherReport(searchStateSetter, statusStateSetter, selectedLocationObj, weatherDataSetter, navigate) {
  searchStateSetter('reloading');
  const weatherReqController = new AbortController();
  const url = 'https://api.open-meteo.com/v1/forecast?';
  const daily = 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,rain_sum,wind_speed_10m_max,sunrise,sunset,precipitation_hours,precipitation_probability_max,sunshine_duration,daylight_duration';
  const hourly = 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature,precipitation_probability,precipitation,visibility,surface_pressure,dew_point_2m,rain,cloud_cover,uv_index';
  const current = 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto';
  const params = new URLSearchParams(
    `latitude=${selectedLocationObj[0].latitude}&longitude=${selectedLocationObj[0].longitude}&daily=${daily}&hourly=${hourly}&current=${current}`
  );
  try {
    const response = await fetch(`${url}${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/JSON'
      },
      signal: weatherReqController.signal
    })
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.reason);
    } else if (!data) {
      throw new Error('Could not get weather info');
    }
    const newWeatherData = data;
    console.log(newWeatherData);
    navigate('/dashboard', {
      replace: true,
      state: [selectedLocationObj, newWeatherData]
    });
    weatherDataSetter(newWeatherData);
    searchStateSetter('not-searched');
  } catch(error) {
    searchStateSetter('searched');
    if (error.message === 'Could not get weather info') {
      statusStateSetter('weather-info-not-retreived');
    } else if (error.message === 'Failed to fetch') {
      statusStateSetter('network-connection-error');
    } else {
      statusStateSetter('error-getting-locations');
    }
    console.error(error.message);
    throw error;
  };
}
function resetStatesToDasnboard(noteStateSetter) {
  noteStateSetter('no-note');
}
function NoteModal({ noteStateSetter }) {
  return (
    <div id='note-modal'>
      <div id='note-cont'>
        <div id='note-inner-cont'>
          <div id='back-cont'><button id='back' onClick={() => resetStatesToDasnboard(noteStateSetter)}
            >Back</button>
          </div>
          <h2><b>NOTE</b></h2>
          <p id='note'>Weather reports are generalized calculation based estimates and may differ from actual conditions in specific parts of a location.</p>
        </div>
      </div>
    </div>
  )
}
function ReloadingOverlay() {
  return (
    <div id='reloading-overlay'>
      <i className='fa-solid fa-circle-notch fa-spin spinner'></i>
    </div>
  )
}
function Header({ validStateSetter, searchStateSetter, selectedLocation, weatherDataSetter, statusStateSetter, validState, dashSearchedState, navigate }) {
  async function handleSearchAndAfter(statusStateSetter, validState) {
    const outcome = await search(validState, dashSearchedState, searchStateSetter);
    if (outcome.status === 'skipped') return;
    updateStates(outcome, statusStateSetter);
  }
  return (
    <div id='header'>
      <div id='page-brand'>WeatherLy</div>
      <button id='back-btn' title='Back' onClick={() => navigate('/')}>←</button>
      <button id='refresh-btn' title='Refresh' onClick={() => updateWeatherReport(searchStateSetter, statusStateSetter, selectedLocation, weatherDataSetter, navigate)}>↻</button>
      <SearchCont validStateSetter={validStateSetter} validateInput={validateInput} startSearch={startSearch} handleSearchAndAfter={() => handleSearchAndAfter(statusStateSetter, validState)} />
      {!validState && <small id='input-caveat'>Only commas are allowed!</small>}
    </div>
  )
}
function WeatherSummary({ selectedLocation, weatherData }) {
  const { time: timeNow, weather_code: weatherCode, is_day: isDay, temperature_2m: temperature, apparent_temperature: apparentTemperature } = weatherData.current;
  const { temperature_2m: temperatureUnit, apparent_temperature: apparentTemperatureUnit } = weatherData.current_units;
  // const responseDate = new Date(timeNow * 1000);
  const { timezone } = weatherData;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    weekday: "short",
    day: "numeric",
  });
  const formattedDateResult = formattedDate.format(new Date(timeNow));
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12"
  });
  const formattedTime = time.format(new Date())
  return (
    <div id='weather-summary-cont'>
      <div id='weather-summary'>
        <Location selectedLocation={selectedLocation} />
        <p id='date-time'>{formattedDateResult + '. ' + formattedTime}</p>
        <div id='weather-cont'>
          <i className={`fa-solid fa-${
            (weatherCode === 0 || weatherCode === 1) && isDay === 1 ? 'sun' : (weatherCode === 0 || weatherCode === 1) && isDay === 0 ? 'moon' : 
            weatherCode === 2 && isDay === 1 ? 'cloud-sun' : weatherCode === 2 && isDay === 0 ? 'cloud-moon' : 
            weatherCode === 3 && isDay === 1 ? 'cloud' : weatherCode === 3 && isDay === 0 ? 'cloud' : 
            weatherCode === 45 || weatherCode === 48 ? 'smog' : 
            (weatherCode === 51 || weatherCode === 53 || weatherCode === 56 || weatherCode === 66) && isDay === 1 ? 'cloud-sun-rain' : 
            (weatherCode === 51 || weatherCode === 53 || weatherCode === 56 || weatherCode === 66) && isDay === 0 ? 'cloud-moon-rain' : 
            [55, 57, 61, 63, 80].includes(weatherCode) ? 'cloud-rain' : 
            [65, 67, 81, 82].includes(weatherCode) ? 'cloud-showers-heavy' : 
            [95, 96, 97, 99].includes(weatherCode) ? 'cloud-bolt' : 
            [71, 73, 75, 77, 85, 86].includes(weatherCode) ? 'cloud-showers-heavy' : ''
          } weatherSummaryIcon`} style={{color: 
            `${[51, 53, 55, 56, 57].includes(weatherCode) ? '#90CAF9' : 
            [61, 62, 66, 80].includes(weatherCode) ? '#64B5F6' : 
            [65, 67, 82].includes(weatherCode) ? '#64B5F6' : 
            [95, 96, 97, 99].includes(weatherCode) ? '#1E88E5' : ''}`
          }}></i>
          <h1 id='temperature'>{`${Number(temperature).toFixed() + temperatureUnit}`}</h1>
        </div>
        <p id='weather-condition'>
          {weatherCode === 0 ? 'Clear sky' : weatherCode === 1 ? 'Sky mainly clear' : 
          weatherCode === 2 ? 'Partly cloudy' : weatherCode === 3 ? 'Cloudy' : weatherCode === 45 ? 'Fog' : weatherCode === 48 ? 'Depositing rime fog' : 
          weatherCode === 51 ? 'Light drizzle' : weatherCode === 53 ? 'Moderate drizzle' : weatherCode === 55 ? 'Dense drizzle' : weatherCode === 56 ? 'Light freezing drizzle' : 
          weatherCode === 57 ? 'Dense freezing drizzle' : weatherCode === 61 ? 'Slight rain' : weatherCode === 63 ? 'Moderate rain' : weatherCode === 65 ? 'Heavy rain' : 
          weatherCode === 66 ? 'Light freezing rain' : weatherCode === 67 ? 'Heavy freezing rain' : weatherCode === 71 ? 'Slight snowfall' : weatherCode === 73 ? 'Moderate snowfall' : 
          weatherCode === 75 ? 'Heavy snowfall' : weatherCode === 77 ? 'Snow grains' : weatherCode === 80 ? 'Slight rain showers' : weatherCode === 81 ? 'Moderate rain showers' : 
          weatherCode === 82 ? 'Violent rain showers' : weatherCode === 85 ? 'Slight snow showers' : weatherCode === 86 ? 'Heavy snow showers' : weatherCode === 95 ? 'Thunderstorm' : 
          weatherCode === 96 ? 'Thunderstorm with slight hail' : weatherCode === 97 ? 'Heavy thunderstorm' : weatherCode === 99 ? 'Thunderstorm with heavy hail' : ''}
        </p>
        <p id='feel-temp'> Currently feels like {`${Number(apparentTemperature).toFixed() + apparentTemperatureUnit}`}</p>
      </div>
    </div>
  )
}
function Location({ selectedLocation }) {
  return (
    <p id='location'>
      🌍 {selectedLocation[0].name}{(selectedLocation[0].admin1 && selectedLocation[0].country) && ', '}
      {(selectedLocation[0].admin1 && selectedLocation[0].name !== selectedLocation[0].admin1) && selectedLocation[0].admin1}
      {(selectedLocation[0].admin1 && selectedLocation[0].name !== selectedLocation[0].admin1) && <br />}{selectedLocation[0].country}
    </p>
  )
}
function InfoCard({ selectedLocation, weatherData }) {
  return (
    <div id='info-card'>
      <Current weatherData={weatherData} />
      <Forecast weatherData={weatherData} />
    </div>
  )
}
function Current({ weatherData }) {
  const { relative_humidity_2m: humidity, wind_speed_10m: windSpeed, wind_direction_10m: windDirection, precipitation, surface_pressure: surfacePressure } = weatherData.current;
  const { relative_humidity_2m: humidityUnit, wind_speed_10m: windSpeedUnit, wind_direction_10m: windDirectionUnit, precipitation: precipitationUnit, surface_pressure: surfacePressureUnit } = weatherData.current_units;
  const [ visibility, ...rest ] = weatherData.hourly.visibility;
  const { visibility: visibilityUnit } = weatherData.hourly_units;
  return (
    <div id='current-cont'>
      <h2>Current</h2>
      <hr style={{marginBottom: '0'}} />
      <div id='current-info-cont'>
        <div className='current-info'>
          <p>💧 Humidity</p>
          <p>{humidity + humidityUnit}</p>
        </div>
        <div className='current-info'>
          <p>💨 Wind Speed</p>
          <p>{windSpeed + windSpeedUnit}</p>
        </div>
        <div className='current-info'>
          <p>🧭 Wind Direction</p>
          <p>{windDirection + windDirectionUnit}</p>
        </div>
        <div className='current-info'>
          <p>👁️ Visibility</p>
          <p>{visibility + visibilityUnit}</p>
        </div>
        <div className='current-info'>
          <p>🌧️ Precipitation</p>
          <p>{precipitation.toFixed() + precipitationUnit}</p>
        </div>
        <div className='current-info'>
          <p>🌡️ Pressure</p>
          <p>{surfacePressure + surfacePressureUnit}</p>
        </div>
      </div>
    </div>
  )
}
function Forecast({ weatherData }) {
  const [forecast, setForecast] = useState('hourly');
  const { time: hourlyResponseDates, temperature_2m: hourlyTemperatures, weather_code: hourlyWeatherCodes } = weatherData.hourly;
  const { temperature_2m: hourlyTemperatureUnit } = weatherData.hourly_units;
  const { time: dailyResponseDates, temperature_2m: dailyTemperatures, weather_code: dailyWeatherCodes } = weatherData.daily;
  const { temperature_2m: dailyTemperatureUnit } = weatherData.daily_units;
  const weatherCodeMeanings = {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "45": "Fog",
    "48": "Depositing rime fog",
    "51": "Light drizzle",
    "53": "Moderate drizzle",
    "55": "Dense drizzle",
    "56": "Light freezing drizzle",
    "57": "Dense freezing drizzle",
    "61": "Slight rain",
    "63": "Moderate rain",
    "65": "Heavy rain",
    "66": "Light freezing rain",
    "67": "Heavy freezing rain",
    "71": "Slight snowfall",
    "73": "Moderate snowfall",
    "75": "Heavy snowfall",
    "77": "Snow grains",
    "80": "Slight rain showers",
    "81": "Moderate rain showers",
    "82": "Violent rain showers",
    "85": "Slight snow showers",
    "86": "Heavy snow showers",
    "95": "Thunderstorm",
    "96": "Thunderstorm with slight hail",
    "97": "Heavy thunderstorm",
    "99": "Thunderstorm with heavy hail"
  }
  const { timezone } = weatherData;
  const timee = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "numeric",
    hourCycle: "h23"
  });
  const formattedJsMonth = timee.format(new Date()).substring(0, 2);
  const formattedJsDay = timee.format(new Date()).substring(3, 5);
  const formattedJsHour = timee.format(new Date()).substring(12, 14);
  function getFormated24Hour(time) {
    const formattedAPIHour = new Date(time).toLocaleDateString("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "numeric",
      hourCycle: "h23"
    });
    return { 
      all: formattedAPIHour,
      year: Number(formattedAPIHour.substring(5, 9)),
      month: Number(formattedAPIHour.substring(0, 2)),
      day: Number(formattedAPIHour.length === 16 ? formattedAPIHour.substring(3, 4) : formattedAPIHour.substring(3, 5)),
      hour: Number(formattedAPIHour.substring(12, 14))
    };
  }
  function getFormated12Hour(time) {
    const formattedHour = new Date(time).toLocaleDateString("en-US", {
      hour: "numeric"
    });
    return formattedHour.substring(11);
  }
  const hourlyResponseDatesArr = [];
  const hourlyWeatherCodesArr = [];
  const hourlyTemperaturesArr = [];
  hourlyResponseDates.forEach((eachResponseDate, index) => {
    if (hourlyResponseDatesArr.length < 24) {
      if (getFormated24Hour(eachResponseDate).hour > formattedJsHour) {
        hourlyResponseDatesArr.push(eachResponseDate);
        hourlyWeatherCodesArr.push(hourlyWeatherCodes[index]);
        hourlyTemperaturesArr.push(hourlyTemperatures[index]);
      } else if (getFormated24Hour(eachResponseDate).hour <= formattedJsHour && getFormated24Hour(eachResponseDate).day > formattedJsDay) {
        hourlyResponseDatesArr.push(eachResponseDate);
        hourlyWeatherCodesArr.push(hourlyWeatherCodes[index]);
        hourlyTemperaturesArr.push(hourlyTemperatures[index]);
      } else if (getFormated24Hour(eachResponseDate).hour <= formattedJsHour && getFormated24Hour(eachResponseDate).day < formattedJsDay && getFormated24Hour(eachResponseDate).month > formattedJsMonth) {
        hourlyResponseDatesArr.push(eachResponseDate);
        hourlyWeatherCodesArr.push(hourlyWeatherCodes[index]);
        hourlyTemperaturesArr.push(hourlyTemperatures[index]);
      }
    }
  })
  function toggleForecastView(e) {
    e.stopPropagation();
    if (forecast === 'hourly' && e.target.className !== 'in-view') {
      setForecast('daily');
    } else if (forecast === 'daily' && e.target.className !== 'in-view') {
      setForecast('hourly');
    } else {
      return;
    }
  }
  return (
    <div id='forecast-cont'>
      <div id='titles-cont'>
        <div id='titles-inner-cont'>
          <h2>Forecast</h2>
          <p>See the weather for the hours ahead or the coming days</p>
        </div>
        <div id='forecast-toggle'>
          <p id='hourly' className={forecast === 'hourly' ? 'in-view' : ''} onClick={(e) => toggleForecastView(e)}>Hourly</p>
          <p id='daily' className={forecast === 'daily' ? 'in-view' : ''} onClick={(e) => toggleForecastView(e)}>Daily</p>
        </div>
      </div>
      {/* <hr style={{width: '100%', marginTop: '10px', marginBottom: '16px'}} /> */}
      {forecast === 'hourly' ? <Hourly hourlyTemperatureUnit={hourlyTemperatureUnit} hourlyWeatherCodesArr={hourlyWeatherCodesArr} hourlyTemperaturesArr={hourlyTemperaturesArr} 
        hourlyResponseDatesArr={hourlyResponseDatesArr} weatherCodeMeanings={weatherCodeMeanings}formattedJsHour={formattedJsHour} formattedJsDay={formattedJsDay} formattedJsMonth={formattedJsMonth} 
        getFormated12Hour={getFormated12Hour} getFormated24Hour={getFormated24Hour} /> :
        <Daily dailyTemperatureUnit={dailyTemperatureUnit} dailyWeatherCodesArr={dailyWeatherCodesArr} dailyTemperaturesArr={dailyTemperaturesArr} dailyResponseDatesArr={dailyResponseDatesArr} 
        weatherCodeMeanings={weatherCodeMeanings} /> 
      }
    </div>
  )
}
function Hourly({ hourlyTemperatureUnit, hourlyWeatherCodesArr, hourlyTemperaturesArr, hourlyResponseDatesArr, weatherCodeMeanings, formattedJsHour, formattedJsDay, formattedJsMonth, getFormated12Hour, getFormated24Hour }) {
  return (
    <div id='forecast-info'>
      {hourlyResponseDatesArr.map((eachDate, index) => {
        const displayedHour = getFormated24Hour(eachDate).hour > formattedJsHour ? getFormated12Hour(eachDate) + ' (today)' : 
          getFormated24Hour(eachDate).hour <= formattedJsHour && getFormated24Hour(eachDate).day > formattedJsDay ? getFormated12Hour(eachDate) + ' (tomorrow)' : 
          getFormated24Hour(eachDate).hour <= formattedJsHour && getFormated24Hour(eachDate).day < formattedJsDay && getFormated24Hour(eachDate).month > formattedJsMonth ? getFormated12Hour(eachDate) + ' (tomorrow)' : 
          null;
        return index < 24 && displayedHour !== null ? 
          <div key={index} className='each-hour'>
            <p><b>{displayedHour}</b></p>
            <div id='forecast-icon'>
              <i className={`fa-solid fa-${
                (hourlyWeatherCodesArr[index] === 0 || hourlyWeatherCodesArr[index] === 1) && [8].includes(getFormated24Hour(eachDate).hour) ? 'cloud-sun' : 
                (hourlyWeatherCodesArr[index] === 0 || hourlyWeatherCodesArr[index] === 1) && [9, 10, 11, 12, 13, 14, 15, 16].includes(getFormated24Hour(eachDate).hour) ? 'sun' : 
                (hourlyWeatherCodesArr[index] === 0 || hourlyWeatherCodesArr[index] === 1) && [17, 18].includes(getFormated24Hour(eachDate).hour) ? 'cloud' : 
                (hourlyWeatherCodesArr[index] === 0 || hourlyWeatherCodesArr[index] === 1) && [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23].includes(getFormated24Hour(eachDate).hour) ? 'moon' : 
                hourlyWeatherCodesArr[index] === 2 && [8, 9, 10, 11, 12, 13, 14, 15, 16].includes(getFormated24Hour(eachDate).hour) ? 'cloud-sun' : 
                hourlyWeatherCodesArr[index] === 2 && [17, 18].includes(getFormated24Hour(eachDate).hour) ? 'cloud' : hourlyWeatherCodesArr[index] === 2 && [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23].includes(getFormated24Hour(eachDate).hour) ? 'cloud-moon' : 
                hourlyWeatherCodesArr[index] === 3 ? 'cloud' : hourlyWeatherCodesArr[index] === 45 || hourlyWeatherCodesArr[index] === 48 ? 'smog' : 
                (hourlyWeatherCodesArr[index] === 51 || hourlyWeatherCodesArr[index] === 53 || hourlyWeatherCodesArr[index] === 56 || hourlyWeatherCodesArr[index] === 66) && [8, 9, 10, 11, 12, 13, 14, 15, 16].includes(getFormated24Hour(eachDate).hour) ? 'cloud-sun-rain' : 
                (hourlyWeatherCodesArr[index] === 51 || hourlyWeatherCodesArr[index] === 53 || hourlyWeatherCodesArr[index] === 56 || hourlyWeatherCodesArr[index] === 66) && [17, 18].includes(getFormated24Hour(eachDate).hour) ? 'cloud-rain' : 
                (hourlyWeatherCodesArr[index] === 51 || hourlyWeatherCodesArr[index] === 53 || hourlyWeatherCodesArr[index] === 56 || hourlyWeatherCodesArr[index] === 66) && [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23].includes(getFormated24Hour(eachDate).hour) ? 'cloud-moon-rain' : 
                [55, 57, 61, 63, 80].includes(hourlyWeatherCodesArr[index]) ? 'cloud-rain' : 
                [65, 67, 81, 82].includes(hourlyWeatherCodesArr[index]) ? 'cloud-showers-heavy' : 
                [95, 96, 97, 99].includes(hourlyWeatherCodesArr[index]) ? 'cloud-bolt' : 
                [71, 73, 75, 77, 85, 86].includes(hourlyWeatherCodesArr[index]) ? 'cloud-showers-heavy' : ''
              } hourly-forecast`} style={{color: 
                `${[51, 53, 55, 56, 57].includes(hourlyWeatherCodesArr[index]) ? '#90CAF9' : 
                [61, 62, 66, 80].includes(hourlyWeatherCodesArr[index]) ? '#64B5F6' : 
                [65, 67, 82].includes(hourlyWeatherCodesArr[index]) ? '#64B5F6' : 
                [95, 96, 97, 99].includes(hourlyWeatherCodesArr[index]) ? '#1E88E5' : ''}`
              }}></i>
            </div>
            <h4>{hourlyTemperaturesArr[index] + hourlyTemperatureUnit}</h4>
            <p>{weatherCodeMeanings[hourlyWeatherCodesArr[index]]}</p>
          </div>
          : null
      })}
    </div>
  )
}
function Daily({ temperatureUnit, weatherCodesArr, temperatureArr, responseDatesArr, weatherCodeMeanings }) {
  return (
    <div id='forecast-info'></div>
  )
}

export default WeatherDashboard;