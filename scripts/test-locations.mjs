import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/home/locations');
    console.log("Response Keys:", Object.keys(res.data));
    console.log("Data Keys:", Object.keys(res.data.data));
    console.log("Categories Count:", res.data.data.categories?.length);
    console.log("Featured Locations Count:", res.data.data.featured_locations?.length);
    console.log("First Category:", res.data.data.categories?.[0]);
  } catch (err) {
    console.error(err);
  }
}

test();
