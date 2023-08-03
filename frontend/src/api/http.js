import axios from 'axios';
let basUrl = ""
if(process.env.NODE_ENV === "development"){
    basUrl = "https://dev.thybanker.com"
}
const instance = axios.create({
    baseURL: basUrl,
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
});
export default instance
