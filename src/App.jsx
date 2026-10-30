import { Routes, Route} from "react-router";
import { useState} from 'react';
import WeatherDashboard from "./dashboard.jsx";
import WelcomeInterface from "./search.jsx";
import { ResultsModal } from "./search.jsx";
import './App.css'

function App() {
  const [searchedState, setSearched] = useState('not-searched');
  const [status, setStatus] = useState('loading');
  const [loadingStatus, setLoadingStatus] = useState('locations-loading');
  const [ , setWeatherData] = useState({});
  const [ , setSelectedLocation] = useState({});
  return (
    <>
      <Routes>
        <Route path="/" element={
          searchedState === 'not-searched' ? <WelcomeInterface searchStateSetter={setSearched} statusStateSetter={setStatus} searchedState={searchedState} /> :
          <>
            <WelcomeInterface searchStateSetter={setSearched} statusStateSetter={setStatus} searchedState={searchedState} /> 
            <ResultsModal searchStateSetter={setSearched} searchedState={searchedState} statusState={status} statusStateSetter={setStatus} 
              loadingStatus={loadingStatus} loadingStatusStateSetter={setLoadingStatus} weatherDataSetter={setWeatherData} selectedLocationSetter={setSelectedLocation}  />
          </>}
        />
        <Route path="/dashboard" element={<WeatherDashboard />} />
      </Routes>
    </>
  )
}

export default App;
