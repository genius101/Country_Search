import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [countryName, setCountryName] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);

  const fetchCountryDetails = async () => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
      const countryData = response.data[0];
      setCountryDetails(countryData);
    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  };

  useEffect(() => {
    if (countryDetails) {
      const borderCountries = countryDetails?.borders || [];
      fetchBorderCountryNames(borderCountries);
    }
  }, [countryDetails]);

  const fetchBorderCountryNames = async (borderCodes) => {
    try {
      const borderCountryNames = await Promise.all(
        borderCodes.map(async (code) => {
          const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
          return response.data[0]?.name?.common || code;
        })
      );
      setCountryDetails((prevDetails) => ({
        ...prevDetails,
        borderCountryNames,
      }));
    } catch (error) {
      console.error('Error fetching border country names:', error);
    }
  };

  const handleCountryNameChange = (event) => {
    setCountryName(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleFetchClick();
    }
  };

  const handleFetchClick = () => {
    if (countryName) {
      fetchCountryDetails();
    }
  };

  return (
    <div className="App">
      <h1>Country Details by Name</h1>
      <div className="input-container">
        <label htmlFor="countryNameInput">Enter Country Name: </label>
        <input
          type="text"
          id="countryNameInput"
          value={countryName}
          onChange={handleCountryNameChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleFetchClick}>Fetch Details</button>
      </div>
      <div className="country-details">
        {countryDetails && (
          <div>
            <h2>Country Details:</h2>
            <ul>
              <li>
                <strong>Country Name:</strong> {countryDetails.name.common}
              </li>
              <li>
                <strong>Capital:</strong> {countryDetails.capital}
              </li>
              <li>
                <strong>Population:</strong>{' '}
                {countryDetails.population.toLocaleString()}
              </li>
              <li>
                <strong>Region:</strong> {countryDetails.region}
              </li>
              <li>
                <strong>Languages:</strong>{' '}
                {Object.values(countryDetails.languages).join(', ')}
              </li>
              <li>
                <strong>Borders:</strong>{' '}
                {countryDetails.borderCountryNames
                  ? countryDetails.borderCountryNames.join(', ')
                  : 'None'}
              </li>
            </ul>
            <div>
              <strong>Flag:</strong>{' '}
              <img
                src={countryDetails.flags.png}
                alt={`${countryDetails.name.common} Flag`}
                width="100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
