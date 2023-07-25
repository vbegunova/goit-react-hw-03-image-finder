import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '36694393-8bc689be0a863a766f731264d';

export const fetchItems = async ( query, page = 1 ) => {
    console.log(query);
    const response = await axios.get('', {
        params: {
            q: query,
            page: page,
            key: API_KEY,
            image_type: 'photo',
            orientation: 'horizontal',
            per_page: 12,
        }
    })
    return response.data.hits;
}