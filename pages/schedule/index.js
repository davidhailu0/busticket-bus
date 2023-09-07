import { useState,useEffect } from "react";
import { Box,Typography,ThemeProvider,createTheme, Button} from "@mui/material";
import jwt from "jsonwebtoken"
import DefaultSelectComponent from "../../components/SelectBox/defaultSelectBox";
import ManagementAppbar from "../../components/ManagementAppbar"
import SideBar from "../../components/sidebar";
import { LocaleLanguage } from "../../utils/LanguageContext";
import client from "../../utils/ApolloServer";
import { gql } from "@apollo/client";
import ManageScheduleCard from "../../components/manageScheduleCard";
import { translateWord } from "../../utils/languageTranslation";

const customTheme = createTheme({
        palette:{
            primary:{
               main:"#629460" 
            }
        }
})

const Schedule= ({locale,schedules,token})=>{
    const [drawerState,setDrawerState] = useState(false) 
    const [selectedFilter,setSelectedFilter] = useState("All")
    const [displayedTrips,setDisplayedTrips] = useState(schedules)

    useEffect(()=>{
        if(selectedFilter==="All"){
            setDisplayedTrips(schedules)
        }
        else{
            setDisplayedTrips(schedules.filter(({departure,destination})=>selectedFilter===departure||selectedFilter===destination))
        }
    },[selectedFilter])

    const filteredDestinationList = ()=>{
        const destinationsList = []
        for(let {departure,destination} of schedules){
            if(!destinationsList.includes(departure)&&departure!=="Addis Ababa"){
                destinationsList.push(departure)
            }
            if(!destinationsList.includes(destination)&&destination!=="Addis Ababa"){
                destinationsList.push(destination)
            }
        }
        destinationsList.unshift("All")
        return destinationsList 
    }

    const addedRoutes = [];
    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"6rem",px:"0.7rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
            <Box sx={{display:"flex",justifyContent:"space-between"}}>
                <Box sx={{ml:5,display:"flex",flexDirection:"column"}}>
                    <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Manage Schedule")}</Typography>
                    <Box sx={{my:"1rem"}}>
                        <Typography sx={{fontWeight:"700",color:"#CCCCCC",fontSize:"20px"}}>{translateWord(locale,"View Scheduling")}</Typography> 
                    </Box>
                </Box>
                <DefaultSelectComponent value={selectedFilter} setValue={setSelectedFilter} options={filteredDestinationList()}/>
            </Box>
            <Box mt={2} ml={5} sx={{display:"grid",rowGap:5}}>
                {
                    displayedTrips.map(({_id,departure,destination,assignedBuses,departureDays})=>{
                        let foundedCard = addedRoutes.find((obj)=>obj.departure===departure&&obj.destination===destination)
                        let firstIndex = addedRoutes.findIndex(obj=>obj["departure"]===departure&&obj["destination"]===destination)
                        let secondIndex = addedRoutes.findIndex(obj=>obj["destination"]===departure&&obj["departure"]===destination)
                        if(firstIndex>=0||secondIndex>=0){
                            return null
                        }
                        addedRoutes.push({departure,destination})
                        addedRoutes.push({destination,departure})
                        foundedCard = schedules.find((obj)=>obj.departure===destination&&obj.destination===departure)
                       return <Box key={_id} sx={{display:"flex",flexDirection:"column",p:"0.5rem",justifyContent:"space-between"}}>
                                <ManageScheduleCard id={_id} departure={departure} destination={destination} departureDate={departureDays} plateNumber={assignedBuses&&assignedBuses.length>0?assignedBuses[0]["plateNumber"]:translateWord(locale,"Unassigned")} returnDate={foundedCard.departureDays}/>
                              </Box>
                    })
                }
            </Box>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,res} = ctx
    const token = req["cookies"]['token']
    const nextLocale = req["cookies"]['NEXT_LOCALE']
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
    const data = await client.query({
        query:gql`
        query scheduledTrips($busCompanyID:ID!){
            scheduledTrips(busCompanyID:$busCompanyID){
                _id
                departure
                destination
                assignedBuses{
                    plateNumber
                }
                departureDays
            }
        }`,variables:{
            busCompanyID:tokenDecoded._id
        }
    })
    return {
        props:{locale:nextLocale||locale,
            schedules:data["data"]["scheduledTrips"],
            token:tokenDecoded
        }
    }
}
export default Schedule;