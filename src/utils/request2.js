import axios from 'axios'


// create an axios instance
const service = axios.create({
  baseURL: 'http://39.106.54.106:8080/Entity/U47b03b310e54f0/tournote2', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor


export default service
