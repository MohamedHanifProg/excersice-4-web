const db = require('../db');
const axios = require('axios');

const getVacationResults = async () => {
    try {
        const [preferences] = await db.query('SELECT * FROM tbl_43_preferences');
        console.log('Preferences fetched:', preferences);

        if (preferences.length < 5) {
            return { message: 'Not all users have submitted their preferences.' };
        }

        const destinationCount = {};
        const vacationTypeCount = {};
        let startDate = null;
        let endDate = null;

        preferences.forEach(pref => {
            destinationCount[pref.destination] = (destinationCount[pref.destination] || 0) + 1;
            vacationTypeCount[pref.vacation_type] = (vacationTypeCount[pref.vacation_type] || 0) + 1;

            if (!startDate || new Date(pref.start_date) > new Date(startDate)) {
                startDate = pref.start_date;
            }
            if (!endDate || new Date(pref.end_date) < new Date(endDate)) {
                endDate = pref.end_date;
            }
        });

        // Determine majority or default to the first user's preference
        const selectedDestination = Object.keys(destinationCount).reduce((a, b) => destinationCount[a] > destinationCount[b] ? a : (destinationCount[a] === destinationCount[b] ? (preferences[0].destination === a ? a : b) : b), preferences[0].destination);
        const selectedVacationType = Object.keys(vacationTypeCount).reduce((a, b) => vacationTypeCount[a] > vacationTypeCount[b] ? a : (vacationTypeCount[a] === vacationTypeCount[b] ? (preferences[0].vacation_type === a ? a : b) : b), preferences[0].vacation_type);

        // Check if there is a valid date range
        if (new Date(startDate) > new Date(endDate)) {
            return { message: 'No common date range found.' };
        }

        // Format dates to a more readable format
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

        // Fetch weather data from OpenWeatherMap API
        const weatherApiKey = '61db8a5831cd04e908d1bf984948a578'; // Your OpenWeatherMap API key
        try {
            const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: selectedDestination,
                    appid: weatherApiKey,
                    units: 'metric'
                }
            });
            const weatherData = weatherResponse.data;

            return {
                destination: selectedDestination,
                vacation_type: selectedVacationType,
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                weather: {
                    temperature: weatherData.main.temp,
                    description: weatherData.weather[0].description
                }
            };
        } catch (weatherError) {
            console.error('Weather API error:', weatherError.response ? weatherError.response.data : weatherError.message);
            return { error: 'Weather API error' };
        }
    } catch (err) {
        console.error('Error fetching vacation results:', err);
        return { error: err.message };
    }
};

module.exports = getVacationResults;
