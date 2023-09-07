import { useState } from "react";
import { Box,Grid,Typography,ThemeProvider,createTheme, Button} from "@mui/material";
import jwt from "jsonwebtoken"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { gql,useMutation } from "@apollo/client";
import ManagementAppbar from "../../components/ManagementAppbar"
import SideBar from "../../components/sidebar";
import TripInfo from "../../components/tripInfo";
import SelectComponent from "../../components/SelectBox";
import SelectComponentBus from "../../components/SelectBox/customeDriverToBusSelect";
import { LocaleLanguage } from "../../utils/LanguageContext";
import client from "../../utils/ApolloServer";
import { downloadFile } from "../../utils/request-api";
import { useCookie } from "../../utils/cookies";
import { translateWord } from "../../utils/languageTranslation";

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#629460" 
        }
    }
})

const MUTATEUPDATETRIP = gql`
mutation updateTrip($id:ID!,$trip: TripUpdateInput,$activity:CreateActivityLog){
    updateTrip(id:$id,trip: $trip,activity:$activity){
        bus{
            _id
        }
    }
}
`

const TripIDPage = ({locale,tripInfo,allBuses,allDriverAssistants,passengers,token})=>{
    const [driverName,setDriverName] = useState(tripInfo["bus"]["_id"])
    const [driverAssistantName,setDriverAssistantName] = useState(tripInfo["driverAssistant"]||"")
    const [drawerState,setDrawerState] = useState(false) 
    const [passengerView,setpassengerView] = useState(false)
    const [getCookie] = useCookie()
    const [updateTrip] = useMutation(MUTATEUPDATETRIP)
    let busDeparted = new Date(parseInt(tripInfo["departureDate"])).getTime()<=new Date(new Date(Date.now()).toDateString()).getTime()&&tripInfo["departureTime"].includes("4")&&((new Date(Date.now()).toLocaleTimeString().includes("AM")&&parseInt(new Date(Date.now()).toLocaleTimeString())>=4)||new Date(Date.now()).toLocaleTimeString().includes("PM"))
    busDeparted = busDeparted || (new Date(parseInt(tripInfo["departureDate"])).getTime()<=new Date(new Date(Date.now()).toDateString()).getTime()&&tripInfo["departureTime"].includes("6")&&new Date(Date.now()).toLocaleTimeString().includes("PM"))

    const goToPassengersView = ()=>{
        setpassengerView(true)
    }

    const onDownloadButtonClicked = ()=>{
        downloadFile(tripInfo["_id"],getCookie("token"))
    }

    const updateTripOnClick = async()=>{
        const {data} = await updateTrip({
            variables:{
                id:tripInfo["_id"],
                trip:{
                    bus:driverName,
                    driverAssistant:driverAssistantName["_id"]
                },
                activity:{
                    companyId:token._id,
                    name:token.accountName
                }
            }
        })
        setDriverName(data["updateTrip"]["bus"]["_id"])
    }
    
    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw",xs:0},pt:"6rem",pl:"5rem",background:"#F5F5F5",height:"90vh",overflow:"hidden",mb:"1rem"}}>
            <Grid container sx={{position:"fixed",left:{md:"20vw",xs:0},right:0,pl:"5rem",pr:"10rem"}}>
                <Grid item md={6} xs={12}>
                    <TripInfo departure={translateWord(locale,tripInfo["departure"])} destination={translateWord(locale,tripInfo["destination"])} departureTime={tripInfo["departureTime"]} departureDate={tripInfo["departureDate"]}/>  
                </Grid>
                <Grid item md={6} xs={12} sx={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:{md:"center",xs:"flex-start"},mt:{xs:"1rem",md:"0.5rem"}}}>
                    <Box sx={{display:"flex",justifyContent:"space-around",alignItems:"center",width:"217px",height:"40px",background:"#629460",borderRadius:"20px",mb:"0.5rem"}}>
                        <Box sx={{display:"flex",borderRadius:"50%",height:"13px",width:"13px",background:!busDeparted?"#34A300":"#696969"}}></Box>
                        <Typography>{!busDeparted?translateWord(locale,"Bus Scheduled"):translateWord(locale,"Bus Departed")}</Typography>
                    </Box>
                    <Box sx={{display:"flex",alignItems:"center"}}>
                        <CheckCircleOutlineIcon sx={{color:"#629460",mr:"1rem"}}/>
                        <Typography sx={{color:"#629460"}}>{tripInfo["bookedSeats"].length} {translateWord(locale," Seat Booked")}</Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{display:"flex",justifyContent:{md:"flex-end",xs:"flex-start"},pr:"6rem",mt:{md:10,xs:20}}}>
                <Button variant="outlined" sx={{textTransform:"none",display:!passengerView?"block":"none"}} onClick={goToPassengersView}>{translateWord(locale,"View Passenger")}</Button>
            </Box>
            <Box sx={{display:!passengerView?"block":"none",mt:"2rem"}}>
                <Typography mt={2}>{translateWord(locale,"Driver")}</Typography>
                <SelectComponentBus label={"Driver"} value={driverName} setValue={setDriverName} options={allBuses} disabled={new Date(parseInt(tripInfo["departureDate"])).getTime()<Date.now()}/>
                <Typography>{translateWord(locale,"Driver Assistant")}</Typography>
                <SelectComponent label={"Driver Assistant"} value={driverAssistantName} setValue={setDriverAssistantName} options={allDriverAssistants} disabled={busDeparted}/>
                <Box>
                    <Button variant="contained" sx={{textTransform:"none",width:"197px",height:"60px",mt:2,fontSize:"20px",fontWeight:700}} disabled={busDeparted} onClick={updateTripOnClick}>{translateWord(locale,"Update")}</Button>
                </Box>
            </Box>
            <Grid container sx={{display:passengerView?"flex":"none",position:"fixed",top:"11rem",left:"20vw",right:0,pl:"5rem",pr:"8.5rem"}}>
                <Grid item md={4}>
                    <Typography sx={{color:"#A3A3A3"}}>{translateWord(locale,"Name")}</Typography>
                </Grid>
                <Grid item md={4}>
                    <Typography sx={{color:"#A3A3A3"}}>{translateWord(locale,"Phone Number")}</Typography>
                </Grid>
                <Grid item md={4}>
                    <Typography sx={{color:"#A3A3A3",ml:"0.5rem"}}>{translateWord(locale,"Pickup Location")}</Typography>
                </Grid>
            </Grid>
            <Box sx={{display:passengerView?"flex":"none",flexDirection:"column",mt:"2rem",height:"50vh",pr:"2rem"}}>
                {
                    passengers.map((obj,ind)=>{
                        return <DisplayPassengerCard key={ind} name={obj.name} phone={obj.phoneNumber} pickupLocation={obj.pickupLocation} ind={ind}/>
                    })
                }
            </Box>
            <Box sx={{display:passengerView?"flex":"none",justifyContent:"flex-end",mr:"2rem",}}>
                <Button variant="contained" sx={{textTransform:"none",position:"absolute",fontWeight:700,width:"197px",height:"60px",fontSize:"20px"}} onClick={onDownloadButtonClicked}>{translateWord(locale,"Download")}</Button>
            </Box>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    )
}


const DisplayPassengerCard = ({name,phone,pickupLocation,ind})=>{
    return (<Box sx={{display:"grid",gridTemplateColumns:"auto auto auto",background:ind%2===0?"#fff":"#F8F8F8",columnGap:23,height:"62px",alignItems:"center",width:"609"}}>
        <Typography>{name}</Typography>
        <Typography ml={3.5}>{phone}</Typography>
        {pickupLocation&&<Typography>{pickupLocation}</Typography>}
    </Box>)
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,params} = ctx
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    const {tripID} = params
    const token = req["cookies"]['token']
    if(!token){
        return {
            redirect:{
                destination:"/",
                permanant: false
            }
        };
    }
    const tokenDecoded = jwt.verify(token,process.env.JWT_KEY)
    if(tokenDecoded.role!=="BUS COMPANY"&&tokenDecoded.role!=="TRIP MANAGER"){
        return {
            redirect:{
                destination:"/",
                permanant: false
            }
        };
    }
    let data = "";
    try{
        data = await client.query({
            query:gql`
            query trip($tripID:ID!){
                trip(id:$tripID){
                    _id
                    departure
                    destination
                    route{
                        departure
                        destination
                    }
                    bus{
                        _id
                        driver{
                            _id
                            name
                        }
                    }
                    departureDate
                    departureTime
                    reservedSeats
                    bookedSeats
                }
            }
            `,variables:{tripID:tripID}
        })
        const allBuses = await client.query({
            query:gql`
            query allBusesOfTheCompany($busCompanyID:ID!){
                allBusesOfTheCompany(busID:$busCompanyID){
                    _id
                    plateNumber
                    driver{
                       name
                    }
                }
            }`,variables:{
                busCompanyID:tokenDecoded._id
            }
    })

        const allDriverAssistant = await client.query({
            query:gql`
            query allDriverAssistants($busCompanyID:ID!){
                allDriverAssistants(busCompanyID:$busCompanyID){
                    _id
                    name
                }
            }`,variables:{
                busCompanyID:tokenDecoded._id
            }
        })

        const passengers = await client.query({
            query:gql`
            query bookedPassengers($tripId:ID!){
                bookedPassengers(tripId:$tripId){
                    name
                    phoneNumber
                    pickupLocation
                }
            }`,variables:{
                tripId:tripID
            }
        })
        const filteredBuses = allBuses["data"]["allBusesOfTheCompany"].filter(obj=>obj["driver"])
        return {
            props:{locale:nextLocale||locale,
                tripInfo:data["data"]["trip"],
                allBuses:filteredBuses,
                allDriverAssistants:allDriverAssistant["data"]["allDriverAssistants"],
                passengers:passengers["data"]["bookedPassengers"],
                token:tokenDecoded
            }
        }
    }
    catch(e){
        return {
            props:{locale:nextLocale||locale}
        }
    }
}
export default TripIDPage;