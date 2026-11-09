import { useNavigate } from "react-router";
import { useState, useEffect } from 'react'

let locationList;
let selectedLocation;
let loactionReqController;
let weatherReqController;
let weatherData;
function resetStatesToWelcome(searchStateSetter, statusStateSetter, loadingStatusStateSetter) {
  searchStateSetter('not-searched');
  statusStateSetter('loading');
  loadingStatusStateSetter('locations-loading');
}
function resetStatesToLocations(statusStateSetter, index, indexSetter) {
  statusStateSetter('locations-gotten');
  indexSetter(index);
}
function abortLoactionsFetch() {
  loactionReqController.abort('Request cancelled by user');
  console.log('Request Aborted!');
}
function abortWeatherFetch() {
  weatherReqController.abort('Request cancelled by user');
  console.log('Request Aborted!');
}
function validateInput(event, validStateSetter) {
  const input = event.target;
  if (!input.value) {
    validStateSetter(true);
    console.log('No input');
    return;
  }
  if (/[./?|!>$#@*<&^~%"'+_=}`{:;)(-]/.test(input.value)) {
    validStateSetter(false);
  } else {
    validStateSetter(true);
  }
}
function startSearch(e) {
  const input = document.getElementById('city-input');
  const searchBtn = document.querySelector('#search-btn');
  if (!input.value || e.key !== 'Enter') {
    return;
  }
  searchBtn.click();
}
function search(validState, searchedState, searchStateSetter, loadingStatusState) {
  const cityField = document.getElementById('city-input');
  const cityInput = cityField.value.trim();
  const params = new URLSearchParams(`name=${cityInput}&count=100`);
  const url = 'https://geocoding-api.open-meteo.com/v1/search?';
  if (!cityInput) {
    return Promise.resolve({ status: 'skipped' });
  }
  if (searchedState !== 'not-searched' && loadingStatusState !== 'locations-loading') {
    return Promise.resolve({ status: 'skipped' });
  }
  if (!validState) {
    console.log('Inputed symbols are not allowed!');
    return Promise.resolve({ status: 'skipped' });
  }
  if (searchedState !== 'searched') {
    searchStateSetter('searched');
  }
  loactionReqController = new AbortController();
  return fetch(`${url}${params}`, {
    method: 'GET',
    headers: {
      Accept: 'application/JSON'
    },
    signal: loactionReqController.signal
  })
  .then(response => {
    if (!response.ok) {
      return { 
        status: 'HTTP error',
        reason: response.statusText
      };
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      return { 
        status: 'App error',
        reason: data.reason
      };
    } else if (!data.results) {
      return { status: 'Location not found' };
    }
    locationList = data.results;
    console.log(locationList);
    const reqStat = {
      status: 'success',
      result: locationList
    };
    return reqStat;
  })
  .catch(error => {
    console.error(error.message);
    if (error.message === 'Failed to fetch') {
      return { status: 'network-connection-error' };
    } else {
      return { status: 'error-getting-locations' };
    }
  });
}
let name, state, country, id, fetchWeather;
function selectLocation(event, statusStateSetter, loadingStatusStateSetter, navigate, weatherDataSetter, selectedLocationSetter, searchStateSetter) {
  let cityField = document.getElementById('city-input');
  const selLoc = event.currentTarget.querySelectorAll('span');
  name = selLoc[0].innerText.trim();
  state = selLoc.length === 3 ? selLoc[1].innerText.trim() : null;
  country = selLoc.length === 3 ? selLoc[2].innerText.trim() : selLoc[1].innerText.trim();
  id = Number(event.currentTarget.getAttribute('id'));
  fetchWeather = function(statusStateSetter, loadingStatusStateSetter, navigate, weatherDataSetter, selectedLocationSetter, searchStateSetter) {
    selectedLocation = {
      name: name,
      state: state,
      country: country,
      id: id
    }
    const {id: SelLocId} = selectedLocation;
    const selectedLocationObj = locationList.filter(location => location.id === SelLocId);
    const selectedCoordinates = {
      lat: selectedLocationObj[0].latitude,
      lng: selectedLocationObj[0].longitude
    }
    statusStateSetter('loading');
    loadingStatusStateSetter('weather-loading');
    weatherReqController = new AbortController();
    const url = 'https://api.open-meteo.com/v1/forecast?';
    const daily = 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,rain_sum,wind_speed_10m_max,sunrise,sunset,precipitation_hours,precipitation_probability_max,sunshine_duration,daylight_duration';
    const hourly = 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature,precipitation_probability,precipitation,visibility,surface_pressure,dew_point_2m,rain,cloud_cover,uv_index';
    const current = 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto';
    const timeFormat = 'unixtime';
    const params = new URLSearchParams(
      `latitude=${selectedCoordinates.lat}&longitude=${selectedCoordinates.lng}&daily=${daily}&hourly=${hourly}&current=${current}`
    );
    return fetch(`${url}${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/JSON'
      },
      signal: weatherReqController.signal
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        throw new Error(data.reason);
      } else if (!data) {
        throw new Error('Could not get weather info');
      }
      weatherData = data;
      console.log(weatherData);
      cityField.value = '';
      const currentRoute = window.location.pathname;
      if (currentRoute === '/WeatherLy/') {
        navigate('/dashboard', {
          state: [selectedLocationObj, weatherData]
        });
        statusStateSetter('locations-gotten');
      } else {
        navigate('/dashboard', {
          replace: true,
          state: [selectedLocationObj, weatherData]
        });
        weatherDataSetter(weatherData);
        selectedLocationSetter(selectedLocationObj);
        searchStateSetter('not-searched');
      }
      loadingStatusStateSetter('locations-loading');
    })
    .catch(error => {
      if (error.message === 'Could not get weather info') {
        statusStateSetter('weather-info-not-retreived');
      } else if (error.message === 'Failed to fetch') {
        statusStateSetter('network-connection-error-weather');
      } else {
        statusStateSetter('error-getting-weather');
      }
      console.error(error.message);
      // throw error;
    });
  }
  fetchWeather(statusStateSetter, loadingStatusStateSetter, navigate, weatherDataSetter, selectedLocationSetter, searchStateSetter);
}
function WelcomeInterface({ searchStateSetter, statusStateSetter, searchedState, validState, validStateSetter, loadingStatusState }) {
  const currentHour = new Date().getHours();
  let timeOfTheDay = '';
  let todIcon = '';
  if (currentHour >= 0 && currentHour < 12) {
    timeOfTheDay = ' morning!';
    todIcon = <i className="fa-solid fa-cloud-sun greeting-icon day"></i>;
  } else if (currentHour >= 12 && currentHour < 16) {
    timeOfTheDay = ' afternoon!';
    todIcon = <i className="fa-solid fa-sun greeting-icon day"></i>;
  } else  if (currentHour >= 16 && currentHour < 20){
    timeOfTheDay = ' evening!';
    todIcon = <i className="fa-solid fa-cloud-moon greeting-icon night"></i>;
  } else {
    timeOfTheDay = ' evening!';
    todIcon = <i className="fa-solid fa-moon greeting-icon night"></i>;
  }
  function handleSearchAndAfter(statusStateSetter, validState) {
    search(validState, searchedState, searchStateSetter, loadingStatusState)
    .then(outcome => {
      if (outcome.status === 'skipped') {
        console.log('One of the conditions failed!');
        return;
      }
      updateStates(outcome, statusStateSetter);
    })
    // Other ways are...
    /* 
    1. if (outcome === undefined) return;... or execute if outcome !== undefined
    2. if (!outcome instanceOf Promise) return;... or execute if outcome instanceOf Promise
    */
  }
  return (
    <>
      <div id='greeting'>Hey there! A lovely<span id='time-of-day'><b>{timeOfTheDay}</b></span> <span id='tod-icon'></span>{todIcon}</div>
      <div id="welcome-cont">
        <h1 id="welcome-heading"><i className="fa-solid fa-cloud-rain heading-icon dark"></i><i className="fa-solid fa-sun heading-icon light"></i>WeatherLy</h1>
        <h4 id="welcome-sub">What's The Weather Like?</h4>
        <SearchCont validStateSetter={validStateSetter} validateInput={validateInput} startSearch={startSearch} handleSearchAndAfter={() => handleSearchAndAfter(statusStateSetter, validState)} />
        {!validState && <small id='input-caveat'><b>Only commas are allowed!</b></small>}
        <p id='last-statement'>Planning your day or just curious? <br /> See what's happening outside and get a glimpse of the days ahead.</p>
      </div>
    </>
  )
}
function updateStates(outcome, statusStateSetter) {
  switch (outcome.status) {
    case 'success': 
      statusStateSetter('locations-gotten');
      break;
    case 'HTTP error': 
      console.log(outcome.reason);
      statusStateSetter(outcome.reason);
      throw new Error(outcome.reason)
    case 'App error': 
      console.log(outcome.reason);
      statusStateSetter(outcome.reason);
      throw new Error(outcome.reason)
    case 'Location not found': 
      statusStateSetter('locations-not-found');
      break;
    case 'network-connection-error': 
      statusStateSetter('network-connection-error-locations');
      break;
    case 'error-getting-locations': 
      statusStateSetter('error-getting-locations');
      break;
  }
}
function SearchCont({ validStateSetter, validateInput, startSearch, handleSearchAndAfter }) {
  return  (
    <div id="search-cont">
      <input id="city-input" type="text" placeholder="Enter City Name..." onKeyDown={startSearch} onInput={((event) => validateInput(event, validStateSetter))}/>
      <button id="search-btn" type="button" onClick={handleSearchAndAfter}>
        <i className="fa-solid fa-search search-icon"></i>
      </button>
    </div>
  )
}
function GettingLocation() {
  return (
    <p>Searching for <b>{document.getElementById('city-input')?.value.trim() || 'your location'}</b>...</p>
  )
}
function GettingWeather() {
  return (
    <p>Getting weather info on <br /> <b>{selectedLocation.name}{selectedLocation.state ? ', ' + selectedLocation.state : 
      !selectedLocation.state && !selectedLocation.country? '' : ', '}
    {selectedLocation.state && <br />}{selectedLocation.country}</b></p>
  )
}
function LoadingState({loadingStatusState, searchStateSetter, index, indexSetter, statusStateSetter, loadingStatusStateSetter}) {
  return (
    <>
      <div id='cancel-cont'><button id='cancel' onClick={() => {
        if (loadingStatusState === 'locations-loading') {
          abortLoactionsFetch();
          resetStatesToWelcome(searchStateSetter, statusStateSetter, loadingStatusStateSetter);
        } else {
          abortWeatherFetch();
          resetStatesToLocations(statusStateSetter, index, indexSetter);
        }
      }}>Cancel</button>
      </div>
      <div id='location-loading-cont'>
        <div id='loading-spinner'><i className="fa-solid fa-circle-notch fa-spin"></i></div>
        {loadingStatusState === 'locations-loading' ? <GettingLocation /> : <GettingWeather />}
      </div>
    </>
  )
}
let updatedStateIndex = 0;
let highlighted = null;
function LocationResults({ locationList, searchStateSetter, statusStateSetter, loadingStatusStateSetter, searchedState, weatherDataSetter, selectedLocationSetter, index, indexSetter, navigate }) {
  useEffect(() => {
    function navigateList(event) {
      const locations = document.getElementsByClassName('location');
      const locationsArr = Array.from(locations)
      for (let i = 0; i < locationsArr.length; i++) {
        locationsArr[i].classList.remove('highlight');
      }
      if (event.key === 'ArrowDown') {
        indexSetter(index + 1);
        updatedStateIndex = index + 1;
      } else if (event.key === 'ArrowUp') {
        indexSetter(index - 1);
        updatedStateIndex = index - 1;
      } else if (event.key === 'Enter') {
        const Highlighted = locationsArr.find(location => location.classList.contains('highlighted'));
        if (Highlighted && searchedState === 'searched') {
          Highlighted.click();
        }
      } else {
        indexSetter(index);
        return;
      }
      console.log(searchedState);
      if (updatedStateIndex === locationsArr.length) {
        indexSetter(locationsArr.length - 1);
      }
      if (updatedStateIndex < 0) {
        indexSetter(0);
        updatedStateIndex = 0;
      }
      highlighted = locationsArr.find(location => location.classList.contains('highlighted'));
      if (highlighted) {
        highlighted.scrollIntoView({block: 'center'});
      }
    }
    document.addEventListener('keydown', navigateList);

    return () => document.removeEventListener('keydown', navigateList);
  });
  return (
    <div id='location-results-cont'>
      <p id='result-info'>{locationList.length} {locationList.length > 1 ? 'locations' : 'location'} found</p>
      <div id='location-list' className={locationList.length <= 11 ? 'remove-scrollbar' : 'add-scrollbar'}>
        <ul>
          {locationList.map((location, locationIndex) => (
            <li key={location.id} id={location.id} className={index === locationIndex ? 'location highlighted' : 'location'} 
              onClick={(event) => {selectLocation(event, statusStateSetter, loadingStatusStateSetter, navigate, weatherDataSetter, selectedLocationSetter, searchStateSetter)}}>
              <span className='location-name'>{location.name}</span>
              {location.country && location.admin1 ? ', ' : !location.country && location.admin1 ? ', ' : location.country && !location.admin1 ? ', ' : ''}
              <span className='location-state'>
                {location.admin1 && location.admin1 !== location.name ? `${location.admin1}` : ''}
              </span>
              {(location.admin1 && location.country && location.admin1 && location.admin1 !== location.name) ? ', ' : 
                !location.admin1 && location.country ? '' : location.admin1 && location.country ? '' : ''}
              {location.country && <span className='location-country'>{location.country}</span>}
            </li>
          ))}
        </ul>
      </div>
      <button id='back-btn' onClick={() => resetStatesToWelcome(searchStateSetter, statusStateSetter, loadingStatusStateSetter)}>Go back</button>
    </div>
  )
}
function NoLocation() {
  return (
    <p>Sorry, We couldn't find your location. <br />Please enter an existing location.</p>
  )
}
function NetworkError() {
  return (
    <p>Network connection interrupted. <br />Please check your connection and try again.</p>
  )
}
function OtherError() {
  return (
    <p>It seems something went wrong. <br />Please try again.</p>
  )
}
function NoWeatherInfo() {
  const {name, state, country, id} = selectedLocation;
  return (
    <p>We couldn't get the weather information on <br /><b>{name}, {state}, {country}</b>. <br />Please try again.</p>
  )
}
function NoResults({ searchStateSetter, statusStateSetter, statusState, loadingStatusStateSetter, loadingStatusState, index, indexSetter, navigate, weatherDataSetter, selectedLocationSetter, searchedState, validState }) {
  return (
    <>
      <div id='back-cont'><button id='back' onClick={() => {
        if (loadingStatusState === 'locations-loading') {
          resetStatesToWelcome(searchStateSetter, statusStateSetter, loadingStatusStateSetter);
        } else {
          resetStatesToLocations(statusStateSetter, index, indexSetter);
        }
        }}>
        Back</button>
      </div>
      <div id='no-results-cont'>
        <h3>{statusState === 'locations-not-found' ? 'Not Found!' : statusState === 'weather-info-not-retreived' ? 'Oops!' : 
          (statusState === 'network-connection-error-locations' || statusState === 'network-connection-error-weather') ? 'Oops!' : 'Oops!'}</h3>
        {statusState === 'locations-not-found' ? <NoLocation /> : statusState === 'weather-info-not-retreived' ? <NoWeatherInfo /> : 
          (statusState === 'network-connection-error-locations' || statusState === 'network-connection-error-weather') ? <NetworkError /> : <OtherError />}
        {(statusState !== 'locations-not-found' || statusState !== 'weather-info-not-retreived') && <button id="retry" 
          onClick={() => {
            if (statusState === 'network-connection-error-locations' || statusState === 'error-getting-locations') {
              // console.log('works');
              statusStateSetter('loading');
              search(validState, searchedState, searchStateSetter, loadingStatusState)
              .then(outcome => {
                if (outcome.status === 'skipped') return;
                // console.log('works');
                updateStates(outcome, statusStateSetter);
              })
              // console.log('works');
            } else if (statusState === 'network-connection-error-weather' || statusState === 'error-getting-weather') { 
              fetchWeather(statusStateSetter, loadingStatusStateSetter, navigate, weatherDataSetter, selectedLocationSetter, searchStateSetter);
            }
          }}>Retry</button>}
      </div>
    </>
  )
}
function ResultsModal({ searchStateSetter, searchedState, statusState, statusStateSetter, loadingStatusState, loadingStatusStateSetter, weatherDataSetter, selectedLocationSetter, validState }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  return (
    <>
      <div id='modal-outer-cont'>
        <div id='modal-inner-cont'>
          {
            statusState === 'loading' ? <LoadingState loadingStatusState={loadingStatusState} searchStateSetter={searchStateSetter} index={index} indexSetter={setIndex} 
              statusStateSetter={statusStateSetter} loadingStatusStateSetter={loadingStatusStateSetter} /> 
            : statusState === 'locations-gotten' ? <LocationResults locationList={locationList} searchStateSetter={searchStateSetter} statusStateSetter={statusStateSetter} 
              loadingStatusStateSetter={loadingStatusStateSetter} searchedState={searchedState} weatherDataSetter={weatherDataSetter} selectedLocationSetter={selectedLocationSetter}
              index={index} indexSetter={setIndex} navigate={navigate} /> 
            : <NoResults searchStateSetter={searchStateSetter} statusStateSetter={statusStateSetter} statusState={statusState} loadingStatusStateSetter={loadingStatusStateSetter} 
              loadingStatusState={loadingStatusState} index={index} indexSetter={setIndex} navigate={navigate} weatherDataSetter={weatherDataSetter} selectedLocationSetter={selectedLocationSetter}
              searchedState={searchedState} validState={validState} />
          }
        </div>
      </div>
    </>
  )
}

export default WelcomeInterface;
export { ResultsModal, weatherData, SearchCont, validateInput, startSearch, search, updateStates };