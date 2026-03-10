import axios from 'axios';

const nominatimUrl = import.meta.env.VITE_NOMINATIM_URL;

export const buildAddressLabel = (s) => {
    const a = s.address;
    const main = [a.road, a.house_number].filter(Boolean).join(" ");
    const city = a.city || a.town || a.village || a.county || "";
    return [main || city, city && main ? city : "", a.country].filter(Boolean).join(", ");
};

export const fetchLocationSuggestions = async (value) => {
    const encoded = encodeURIComponent(value);
    const res = await axios.get(
        `${nominatimUrl}/search?q=${encoded}&format=json&limit=10&addressdetails=1&countrycodes=il`,
        { headers: { "Accept-Language": "en" } }
    );
    return res.data.filter(s => {
        const a = s.address;
        return a.road || a.city || a.town || a.village || a.county;
    });
};

