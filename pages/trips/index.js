import { useState,useEffect } from "react";
import { Box,Typography,ThemeProvider,createTheme, IconButton} from "@mui/material";
import jwt from "jsonwebtoken"
import { ClimbingBoxLoader } from "react-spinners";
import { css } from "@emotion/react";
import ManagementAppbar from "../../components/ManagementAppbar"
import SideBar from "../../components/sidebar";
import DefaultSelectComponent from "../../components/SelectBox/defaultSelectBox";
import { gql } from "@apollo/client";
import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import ArrowForward from '@mui/icons-material/ArrowForwardIos';
import { LocaleLanguage } from "../../utils/LanguageContext";
import ManageTripCard from "../../components/manageTripCard";
import client from "../../utils/ApolloServer";
import { translateWord } from "../../utils/languageTranslation";

const override = css`
    position: fixed;
    top: 40%;
    left: 50%;
    border-width: 10px;
    height:100px;
    z-index:15;
    `;

    const customTheme = createTheme({
        palette:{
            primary:{
               main:"#629460" 
            }
        }
    })

const ManageTrips= ({locale,trips,token})=>{
    const tomorrowDate = new Date(new Date().toLocaleDateString()+" UTC")
    tomorrowDate.setDate(tomorrowDate.getDate()+1)
    const [loading] = useState(false)
    const [drawerState,setDrawerState] = useState(false) 
    const [selectedFilter,setSelectedFilter] = useState("All")
    const [filteredDate,setFilteredDate] = useState(tomorrowDate.getTime())
    const [displayedTrips,setDisplayedTrips] = useState(trips.filter(({departureDate})=>new Date(parseInt(departureDate)).getTime()===tomorrowDate.getTime()))

    useEffect(()=>{
        if(selectedFilter==="All"){
            setDisplayedTrips(trips.filter(({departureDate})=>filteredDate===new Date(parseInt(departureDate)).getTime()))
        }
        else{
            setDisplayedTrips(trips.filter(({departureDate,departure,destination})=>filteredDate===new Date(parseInt(departureDate)).getTime()&&(selectedFilter===departure||selectedFilter===destination)))
        }
    },[selectedFilter])
    const filteredDestinationList = ()=>{
        const destinationsList = []
        for(let {departure,destination} of trips){
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

    const displayDate = ()=>{
        const todayDate = new Date(new Date().toLocaleDateString()+" UTC")
        if(filteredDate===tomorrowDate.getTime()){
            return translateWord(locale,"Tomorrow")
        }
        if(filteredDate===todayDate.getTime()){
            return translateWord(locale,"Today")
        }
        todayDate.setDate(todayDate.getDate()-1)
        if(todayDate.getTime()===filteredDate){
            return translateWord(locale,"Yesterday")
        }
        let modifiedDate = new Date(filteredDate).toDateString().split(" ")
        modifiedDate[0] = translateWord(locale,modifiedDate[0])
        modifiedDate[1] = translateWord(locale,modifiedDate[1])
        return modifiedDate.join(" ")
    }

    const previous = ()=>{
        const date = new Date(filteredDate)
        date.setDate(date.getDate()-1)
        if(selectedFilter==="All"){
            setDisplayedTrips(trips.filter(({departureDate})=>date.getTime()===new Date(parseInt(departureDate)).getTime()))
        }
        else{
            setDisplayedTrips(trips.filter(({departureDate,departure,destination})=>date.getTime()===new Date(parseInt(departureDate)).getTime()&&(selectedFilter===departure||selectedFilter===destination)))
        }
        setFilteredDate(date.getTime())
    }

    const next = ()=>{
        const date = new Date(filteredDate)
        date.setDate(date.getDate()+1)
        if(selectedFilter==="All"){
            setDisplayedTrips(trips.filter(({departureDate})=>date.getTime()===new Date(parseInt(departureDate)).getTime()))
        }
        else{
            setDisplayedTrips(trips.filter(({departureDate,departure,destination})=>date.getTime()===new Date(parseInt(departureDate)).getTime()&&(selectedFilter===departure||selectedFilter===destination)))
        }
        setFilteredDate(date.getTime())
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <ClimbingBoxLoader color={'#36D7B7'}loading={loading} css={override} height={150} width={10} margin={3}/>
        <Box sx={{ml:{md:"20vw"},pt:"6rem",px:"0.7rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
            <Box sx={{pl:{md:5,xs:3},py:2,background:"#F5F5F5",position:"fixed",top:"3rem",left:{md:"20vw",xs:0},right:0,zIndex:5,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <Box sx={{display:"flex",flexDirection:"column"}}>
                    <Typography variant="h4" sx={{fontWeight:"700",}}>{translateWord(locale,"Manage Trips")}</Typography>
                    <Box sx={{display:"flex",alignItems:"center"}}>
                        <IconButton onClick={previous}>
                            <ArrowBack/>
                        </IconButton>
                        <Typography>{displayDate()}</Typography>
                        <IconButton onClick={next}>
                            <ArrowForward/>
                        </IconButton>
                    </Box>
                </Box>
                <DefaultSelectComponent value={selectedFilter} setValue={setSelectedFilter} options={filteredDestinationList()}/>
            </Box>
            <Box mt={{md:9,xs:15}} ml={5}>
                {displayedTrips.map(({_id,departure,destination,departureTime,bookedSeats})=><ManageTripCard key={_id} departure={departure} destination={destination} passengersCount={bookedSeats.length} departureTime={departureTime} tripID={_id}/>)}
            </Box>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,res} = ctx
    const nextLocale = req["cookies"]['NEXT_LOCALE']
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
    const data = await client.query({
        query:gql`
        query tripForBusCompany($busID:ID){
            tripForBusCompany(busCompanyId:$busID){
                _id
                departure
                destination
                route{
                    departure
                    destination
                }
                departureDate
                departureTime
                reservedSeats
                bookedSeats
            }
        }
        `,variables:{busID:tokenDecoded._id}
    })
    return {
        props:{locale:nextLocale||locale,
            trips:data["data"]["tripForBusCompany"],
            token:tokenDecoded
        }
    }
}
export default ManageTrips;