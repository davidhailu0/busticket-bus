import axios from 'axios'
import { saveAs } from 'file-saver'

export const baseURL = `http://${process.env.NEXT_PUBLIC_APP_HOST}:${process.env.NEXT_PUBLIC_APP_PORT}/api/v1`

export const postRequest = async(endpoint,data,token)=>{
    try{
        const resp = await axios.post(`${baseURL}${endpoint}`,data,{
            headers:{
                token:token
            }
        })
        console.log(resp.data)
        return resp.data;
    }
    catch(e){
        console.clear()
        return e.response.data
    }
}

export const getRequest = async(endpoint,token)=>{
    try{
        const resp = await axios.get(`${baseURL}${endpoint}`,{headers:{
            token:token
        }})
        return resp.data
    }
    catch(e){
        return e.message
    }
}

export const fetcher = (url)=>fetch(url).then(resp=>resp.json())

const failure = ()=>{
    console.warn("Getting the Location Coordinates Failed")
    return "";
}

export const getClientCoordinates = async(success)=>{
    let coordinates = ""
    if(navigator.geolocation){
        const result = await navigator.permissions.query({name:"geolocation"})
        if(result.state === "granted"){
            navigator.geolocation.getCurrentPosition(success)
            return coordinates
        }
        else if(result.state === "prompt"){
            navigator.geolocation.getCurrentPosition(success,failure)
            return coordinates
        }
        return ""
    }
}

export const getClientCityFromCoordinates = async(lat,long)=>{
    try{
        const resp = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
        return resp.data
    }
    catch(e){
        console.error("There is an error fetching the Client Location")
        return 
    }
}

const getClientIPv4 = async()=>{
    const ipURL = "https://jsonip.com";
    try{
        const ipData = await fetch(ipURL)
        const ipDataJson = await ipData.json()
        return ipDataJson["ip"]
    }
    catch(e){
        console.error("There is an error fetching the IP")
    }
}

export const sendAndUploadFile = async(file,data)=>{
    let formData = new FormData()
    formData.append('file',file)
    Object.keys(data).forEach((key)=>{
        formData.append(key,data[key])
    })
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/v1/auth/bus/signup`,{method:"POST",body:formData});
    const responseJSON = await response.json()
    return responseJSON
}

export const getClientIpLocation = async()=>{
    try{
        const ipAddress = await getClientIPv4()
        const getLocationData = await axios.get(`${process.env.NEXT_PUBLIC_APP_HOST}/getCity/${ipAddress}`)
        return getLocationData.data;
    }
    catch(e){
        console.error(e.message)
    }
}

export const uploadFile = async(file,type,token)=>{
    const busProviderId = sessionStorage.getItem("busID")
    const busProviderName = sessionStorage.getItem("busProvider")
    let formData = new FormData()
    formData.append(type,file)
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/v1/upload${type}`,{method:"POST",body:formData,headers:{busProvider:busProviderName.replaceAll(" ",""),busProviderID:busProviderId,token:token}});
    const responseJSON = await response.json()
    return responseJSON["data"]
}

export const downloadFile = async(tripId,token)=>{
    try{
        await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/v1/downloadPassengers/${tripId}`,{headers:{token}})
    }
    catch(e){
        console.log(e.message)
    }
}