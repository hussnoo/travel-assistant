require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.get('/api/restaurants', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants%20in%20${city}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            const restaurants = response.data.results.map(place => ({
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
            }));
            res.json(restaurants);
        } else {
            res.status(500).json({ error: response.data.status });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data from Google Places API' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
