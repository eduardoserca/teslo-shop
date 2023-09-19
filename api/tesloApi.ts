import axios from "axios";

const tesloApi = axios.create({
    baseURL:'/api'
    //baseURL:'https://teslo-shop-delta-nine.vercel.app/api'
});

export default tesloApi;