import { useState,useEffect } from "react"
import Image from "next/image"
import { Typography,Box,Button,TextField } from "@mui/material"
import DateRangePicker from "/components/datePickerRange"
import SelectComponent from "../selectComponent"
import {postRequest} from '/utils/request-api'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import swal from "sweetalert";
import { useLocale } from "../../utils/LanguageContext"
import { places } from "/utils/places"
import { getClientIpLocation } from "../../utils/request-api"
import {translateWord} from "/utils/languageTranslation"
import { useCookie } from "../../utils/cookies"

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#10c9a7",
        },
    }
}) 

export default function BusCompanyForm(){
    const [startingPlace,setStartingPlace] = useState("")
    const [destination,setDestination] = useState("")
    const [ticketPrice,setTicketPrice] = useState("")
    const [departureDateValue,setDepartureDate] = useState("")
    const [starting_placeError,setStartingPlaceError] = useState(false)
    const [destinationError,setDestinationError] = useState(false)
    const [ticketPriceError,setTicketPriceError] = useState(false)
    const [departureDateError,setDepartureDateError] = useState("")
    const {locale,busCompany} = useLocale()
    const [getCookie,setCookie] = useCookie()

    useEffect(()=>{
        async function fetchCity(){
                const cityData = await getClientIpLocation()
                const thereIs = places.find(plc=>plc.name===cityData["city"])
                if(thereIs){
                    setStartingPlace(cityData["city"])
                }
        }
            fetchCity()
    },[getCookie,setCookie])

    const submitForm = async(e)=>{
        e.preventDefault()
        if(startingPlace&&destination&&ticketPrice&&departureDateValue){
            try{
                await postRequest("/trip/addTrip",{
                    starting_place:startingPlace,
                    busLogo:busCompany["logo"],
                    destination,price:parseInt(ticketPrice),busProvider:busCompany["name"],dateFrom:departureDateValue[0],dateUpto:departureDateValue[1]
                },getCookie("token"))
                swal("Success!", "Your Trip has been added!", "success");
            }
            catch(e){
                console.log(e)
                swal("Oops!", "Something went wrong!", "error");
            }
        }
        else{
            !startingPlace&&setStartingPlaceError(true);
            !destination&&setDestinationError(true)
            !ticketPrice&&setTicketPriceError(true)
            !departureDateValue&&setDepartureDateError("error")
        }
    }

    const handleChange = (range)=>{
        setDepartureDate(range)
        setDepartureDateError("")
    }

    const changeTicketPrice = (val)=>{
        setTicketPrice(val)
        setTicketPriceError(false)
    }
    
    return <Box component={'form'} sx={{width:"80%",margin:"2rem auto 0",pb:"2rem",background:"#F5F5F5"}}>
        <Typography textAlign={"center"} variant="h3" marginBottom={"1rem"}>{translateWord(locale,"Add Trips")}</Typography>
        <Box sx={{display:{md:"flex",xs:"block"},justifyContent:{md:"space-evenly",xs:"center"},textAlign:"center"}}>
        {startingPlace&&<Box sx={{paddingRight:{md:destination?"0":"25%"}}}><Image src={places.find((plc)=>plc.name===startingPlace).image} height="200" width={"225"} alt={startingPlace} style={{marginRight:"0"}}/></Box>}
        <Box sx={{display:{md:"inline",xs:"none"}}}>{destination&&<Image src={places.find((plc)=>plc.name===destination).image} height="200" width={"225"} alt={destination} />}</Box>
     </Box>
        <SelectComponent label={"From"} value={startingPlace} setValue={(e)=>setStartingPlace(e.target.value)} setError={setStartingPlaceError} options={places} error={starting_placeError} fullwidth={false}/>
            <Box sx={{display:{md:"none",xs:"block",textAlign:"center"}}}>{destination&&<Image style={{margin:"0 .7rem"}} src={places.find((plc)=>plc.name===destination).image} height="200" width={"225"} alt={destination} />}</Box>
        <SelectComponent label={"To"} value={destination} setValue={(e)=>setDestination(e.target.value)} options={places} error={destinationError} setError={setDestinationError} fullwidth={false} differentFrom={startingPlace}/>
        <DateRangePicker handleChange={handleChange} error={departureDateError}/>
        <ThemeProvider theme={customTheme}>
        <TextField value={ticketPrice} label={translateWord(locale,"Ticket Price")} type={"number"} inputProps={{min: 0 }} onChange={(e)=>changeTicketPrice(e.target.value)} error={ticketPriceError} sx={{width:"96%",m:"1rem 0.5rem 2rem",":hover fieldset":{borderWidth:"3px"}}}/>
        </ThemeProvider> 
        <Button type="submit" testbutton="addtrip" onClick={submitForm} variant="contained" sx={{backgroundColor:"#10c9a7",display:"block",margin:"2rem auto 0",textAlign:"center",":hover":{backgroundColor:"black"}}}>{translateWord(locale,"Add")}</Button>
        </Box>
}