// pages/api/fetchLocation.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { latitude, longitude } = req.query;        
        console.log("api: ",latitude,longitude)
        const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
        if (response.data && response.data.results && response.data.results.length > 0) {
            const addressComponents = response.data.results[0].address_components;
            let city = "";
            let zipCode = "";
            addressComponents.forEach((component: any) => {
                if (component.types.includes("locality")) {
                    city = component.long_name;
                } else if (component.types.includes("postal_code")) {
                    zipCode = component.long_name;
                }
            });
            const locationData = { city, zipCode };
            res.status(200).json({ locationData });
        } else {
            res.status(404).json({ error: 'Location data not found' });
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
