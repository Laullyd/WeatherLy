import { Routes, Route} from "react-router";
import { useState} from 'react';
import WeatherDashboard from "./dashboard.jsx";
import WelcomeInterface from "./search.jsx";
import { ResultsModal } from "./search.jsx";
import './App.css'

function App() {
  const [searchedState, setSearched] = useState('not-searched');
  const [modalStatus, setModalStatus] = useState('loading');
  const [loadingStatus, setLoadingStatus] = useState('locations-loading');
  const [ , setWeatherData] = useState({});
  const [ , setSelectedLocation] = useState({});
  const [validState, setValidationState] = useState(true);
  return (
    <>
      <Routes>
        <Route path="/" element={
          searchedState === 'not-searched' ? <WelcomeInterface searchStateSetter={setSearched} statusStateSetter={setModalStatus} searchedState={searchedState} validState={validState} 
            validStateSetter={setValidationState} loadingStatusState={loadingStatus} /> :
          <>
            <WelcomeInterface searchStateSetter={setSearched} statusStateSetter={setModalStatus} searchedState={searchedState} validState={validState} validStateSetter={setValidationState} 
               loadingStatusState={loadingStatus} /> 
            <ResultsModal searchStateSetter={setSearched} searchedState={searchedState} statusState={modalStatus} statusStateSetter={setModalStatus} loadingStatusState={loadingStatus} 
              loadingStatusStateSetter={setLoadingStatus} weatherDataSetter={setWeatherData} selectedLocationSetter={setSelectedLocation} validState={validState} />
          </>}
        />
        <Route path="/dashboard" element={<WeatherDashboard />} />
      </Routes>
    </>
  )
}

export default App;
