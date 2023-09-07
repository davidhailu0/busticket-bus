import { useState} from "react";
import { Box,Typography,ThemeProvider,createTheme, Button,Grid} from "@mui/material";
import jwt from "jsonwebtoken"
import { useRouter } from "next/router";
import ManagementAppbar from "../../components/ManagementAppbar"
import SideBar from "../../components/sidebar";
import { ToastContainer,toast } from "react-toastify";
import { LocaleLanguage } from "../../utils/LanguageContext";
import client from "../../utils/ApolloServer";
import { gql,useMutation } from "@apollo/client";
import EastIcon from '@mui/icons-material/East';
import GroupedSchedule from "../../components/managedSchedule";
import { GroupedDataContext } from "../../utils/GroupDataContext";
import { translateWord } from "../../utils/languageTranslation";

const customTheme = createTheme({
        palette:{
            primary:{
               main:"#629460" 
            }
        }
})

const MUTATIONUPDATESCHEDULE = gql`
mutation updateScheduledTrip($id:ID!,$updatedSchedule:updateScheduledInput!,$activity:CreateActivityLog){
    updateScheduledTrip(id:$id,updatedSchedule:$updatedSchedule,activity:$activity){
                assignedBuses{
                    _id
                }
                departureDays
    }
}`

const Schedule= ({locale,specificSchedule,buses,token})=>{
    const scheduleDaysConverted = (dates)=>{
        let days = []
        for(let dt of dates){
            const tempDates = dt.map(dy=>new Date(parseInt(dy)).getTime().toString())
            days.push(tempDates)
        }
        if(days.length===0){
            return [[]]
        }
        return days
    }

    const timeParser = (type)=>{
        if(specificSchedule[type]&&specificSchedule[type].length>0){
            let newSchedule = []
            if(type!=="returnTime"){
                newSchedule = specificSchedule[type].map(dpTime=>{
                    let newDpTime = dpTime;
                    if(newDpTime.includes(null)){
                        let indexOfNull = newDpTime.indexOf(null)
                        newDpTime[indexOfNull] = "4:00 AM"
                        return newDpTime
                    }
                    return newDpTime
                })
            }
            else{
                newSchedule = specificSchedule[type].map(dpTime=>{
                    let newDpTime = dpTime;
                    if(newDpTime.includes(null)){
                        let indexOfNull = newDpTime.indexOf(null)
                        if(specificSchedule["duration"]<=6){
                            newDpTime[indexOfNull] = "6:00 PM"
                            return newDpTime
                        }
                        else{
                            newDpTime[indexOfNull] = "4:00 AM"
                            return newDpTime
                        }
                    }
                    return newDpTime
                })
            }
            return newSchedule
        }
        else if(type==="returnTime"&&specificSchedule["duration"]<=6){
            return [["6:00 PM"]]
        }
        return [["4:00 AM"]]
    }

    const [drawerState,setDrawerState] = useState(false) 
    const router = useRouter()
    const [busesDate,setBusDate] = useState(buses)
    const [availableBuses,setAvailableBuses] = useState([buses])
    const [selectedBuses,setSelectedBuses] = useState((specificSchedule["assignedBuses"].length>0&&specificSchedule["assignedBuses"].map(({_id})=>_id))||[""])
    const [departureTime,setDepartureTime] = useState(timeParser("departureTime"))
    const [returnTime,setReturnTime] = useState(timeParser("returnTime"))
    const [busErrors,setBusErrors] = useState([false])
    const [departureDates,setDepartureDates] = useState(scheduleDaysConverted(specificSchedule["departureDays"]))
    const [departureDateError,setDepartureDateError] = useState([false])
    const [returnDates,setReturnDates] = useState(scheduleDaysConverted(specificSchedule["returnDays"]))
    const [returnDateError,setReturnDateError] = useState([false])
    const [updateSchedule] = useMutation(MUTATIONUPDATESCHEDULE)
    const [groupedSchedule,setGroupedSchedule] = useState((specificSchedule["assignedBuses"].length>0&&specificSchedule["assignedBuses"].map((obj,ind)=>`${ind}`))||["0"])

    const validateInputs = ()=>{
        let returnedValue = true
        for(let ind in selectedBuses){
            if(selectedBuses[ind]===""){
                setBusErrors(prev=>{
                    let newPrev = [...prev]
                    newPrev[ind] = true
                    return newPrev
                })
                returnedValue = false
            }
        }
        for(let ind in departureDates){
            if(departureDates[ind].length===0){
                setDepartureDateError(prev=>{
                    let newPrev = [...prev]
                    newPrev[ind] = true
                    return newPrev
                })
                returnedValue = false
            }
        }
        return returnedValue
    }

    const verifyDepartureDaysAndReturnDays = ()=>{
        let count = 0;
        for(let arr of departureDates){
            if(arr.length!==returnDates[count].length){
                return false
            }
            count++;
        }
        return true
    }

    const verifyDepartureDaysAndReturnDaysInterval = ()=>{
        const departureDatesSorted = departureDates.map(arr=>arr.map(tm=>parseInt(tm)).sort((a,b)=>parseInt(a)-parseInt(b)))
        const returnDatesSorted = returnDates.map(arr=>arr.map(tm=>parseInt(tm)).sort((a,b)=>parseInt(a)-parseInt(b)))
        let flag = true;
        departureDatesSorted.forEach((arr,indexTop)=>{
            arr.forEach((tm,ind)=>{
                if((returnDatesSorted[indexTop][ind]-tm)>172800000){
                    flag = false
                    return
                }
            })
            if(!flag){
                return
            }
        })
        return flag
    }

    const onBTNClick = async()=>{
        if(validateInputs()&&verifyDepartureDaysAndReturnDays()&&verifyDepartureDaysAndReturnDaysInterval()){
                await updateSchedule({
                    variables:{
                        id:specificSchedule["_id"],
                        updatedSchedule:{
                            assignedBuses:selectedBuses,
                            departureDays:departureDates,
                            returnDays:returnDates,
                            departureTime:departureTime,
                            returnTime:returnTime
                        },
                        activity:{
                            companyId:token._id,
                            name:token.accountName
                        }
                    }
            })
            await router.replace("/schedule")
        }
        else if(!verifyDepartureDaysAndReturnDays()){
            toast.error("Please Enter Equal Number of Departure days and return days")
        }
        else if(!verifyDepartureDaysAndReturnDaysInterval()){
            toast.error("Please Correct the departure and return dates")
        }
    }

    return (<ThemeProvider theme={customTheme}>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"5rem",px:"0.7rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
            <Box sx={{ml:5,display:"flex",flexDirection:"column"}}>
                <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Manage Schedule")}</Typography>
                <Box sx={{my:"1rem"}}>
                    <Typography sx={{fontWeight:"700",color:"#CCCCCC",fontSize:"20px"}}>{translateWord(locale,"View Scheduled Trips")}</Typography> 
                </Box>
            </Box>
            <Grid container spacing={2} mt={2} ml={3}>
            <Grid item md={12}>
                <Box sx={{display:"flex",fontWeight:700,fontSize:"20px"}}>
                    <Typography fontWeight={700} mr={"1rem"}>{translateWord(locale,specificSchedule["departure"])}</Typography>
                    <EastIcon/>
                    <Typography fontWeight={700} ml={"1rem"}>{translateWord(locale,specificSchedule["destination"])}</Typography>
                </Box>
            </Grid>
            <GroupedDataContext.Provider value={{availableBuses,selectedBuses,busesInfo:busesDate,busErrors,departureDates,returnDates,departureTime,departureDateError,returnDateError,returnTime,setReturnTime,setDepartureDates,setReturnDates,setDepartureTime,setDepartureDateError,setReturnDateError,setAvailableBuses,setBusDate,setBusErrors,setSelectedBuses,setGroupedSchedule}}>
                {groupedSchedule.map((el)=><GroupedSchedule key={el} ind={el} duration={specificSchedule["duration"]}/>)}
            </GroupedDataContext.Provider>
            <Grid item sx={{mb:"2rem",display:"flex",justifyContent:"space-between",width:"522px"}}>
                <Button variant="contained" sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}} onClick={onBTNClick}>{translateWord(locale,"Save")}</Button>
            </Grid>
        </Grid>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,params} = ctx
    const token = req["cookies"]['token']
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    const {scheduleID} = params
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
            const specificSchedule = await client.query({
                query:gql`
                query scheduledTrip($tripID:ID!){
                    scheduledTrip(tripID:$tripID){
                        _id
                        departure
                        destination
                        assignedBuses{
                            _id
                            plateNumber
                            driver{
                                _id
                                name
                            }
                        }
                        departureDays
                        returnDays
                        duration
                        departureTime
                        returnTime
                    }
                }`,variables:{
                    tripID:scheduleID
                }
            })
            console.log(specificSchedule.data)
            const buses = await client.query({
                query:gql`
                query allBusesOfTheCompany($busID:ID!){
                    allBusesOfTheCompany(busID:$busID){
                        _id
                        plateNumber
                        driver{
                            _id
                            name
                        }
                        assignedDates
                    }
                }`,variables:{
                    busID:tokenDecoded._id
                }
            })
            const filterBusesWithNoDriver = buses['data']['allBusesOfTheCompany'].filter(({driver})=>driver!==null)
    return {
        props:{locale:nextLocale||locale,
            specificSchedule:specificSchedule['data']['scheduledTrip'],
            buses:filterBusesWithNoDriver,
            token:tokenDecoded
        }
    }
}
export default Schedule;