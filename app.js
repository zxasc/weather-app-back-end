require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const weatherController = require('./controllers/weatherController');

app.listen(3000);

const apiKey = process.env.API_KEY;


app.get('/:city', cors({ origin: 'https://magical-lamington-58153c.netlify.app/' }), (req, res) => {
    const cityInput = req.params.city;
    var name;

    // Get geolocation and city name
    axios
        .get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`)
        .then((geoRes) => {
            const lat = geoRes.data[0].lat;
            const lon = geoRes.data[0].lon;
            name = geoRes.data[0].name;

            return axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=alerts&units=metric&appid=${apiKey}`);
        })
        .then((premiumRes) => {
            const preparedData = weatherController.prepareData({...premiumRes.data, name: name})
            res.send(preparedData)
        })
        .catch((err) => {
            console.error(err);
        })
    
})
