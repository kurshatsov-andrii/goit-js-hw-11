import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38627834-dc2fd3d8d485c2fb974c91b78';
export const PER_PAGE = 40;

export async function searchData(searchQuery, page) {
  const resp = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`
  );
  return resp;
}
