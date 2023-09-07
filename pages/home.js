import { useEffect, useState } from "react"
import { Box,IconButton,ThemeProvider,Toolbar, Typography, createTheme } from "@mui/material"
import jwt from "jsonwebtoken"
import { gql,useMutation } from "@apollo/client"
import ManagementAppbar from "../components/ManagementAppbar"
import SideBar from "../components/sidebar"
import DetailCard from "../components/DetailCard";
import CustomLineChart from "../components/LineChart"
import paymentImage from "../Assets/images/paymentImage.png"
import ticketImage from "../Assets/images/ticketImage.png"
import tripImage from "../Assets/images/tripIcon.png"
import { LocaleLanguage } from "../utils/LanguageContext"
import client from "../utils/ApolloServer"
import DefaultSelectComponent from "../components/SelectBox/defaultSelectBox";
import { translateWord } from "../utils/languageTranslation"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"

const FILTERTYPES = ["Daily","Monthly","Yearly"]

const customTheme = createTheme({palette:{primary:{main:"#629460"}}})

const MUTATEDAYS = gql`
 mutation getBusCompanyDataWithParam($id:ID,$date:String){
        getBusCompanyDataWithParam(id:$id,date:$date){
              numberOfTrips
              ticketsPurchased
              totalRevenue 
        }
 }`

export default function Home({locale,data,token}) {
  const [drawerState,setDrawerState] = useState(false) 
  const [type,setType] = useState("Daily")
  const [day,setDay] = useState(new Date(new Date().toLocaleDateString()+" UTC"))
  const [month,setMonth] = useState(new Date().toLocaleDateString()+" UTC")
  const [year,setYear] = useState(new Date().getFullYear())
  const [changeFilter] = useMutation(MUTATEDAYS)
  const [ticketsPurchased,setTicketsPurchased] = useState(data["ticketsPurchased"])
  const [numberOfTrips,setNumberOfTrips] = useState(data["numberOfTrips"])
  const [totalEarnedAmount,setTotalEarnedAmount] = useState(data["totalRevenue"])

  useEffect(()=>{
    switch(type){
      case "Daily":
        changeDaily(day)
        break;
      case "Monthly":
        changeMonthly(new Date(month))
        break;
      case "Yearly":
        changeYearly(year)
        break;
    }

  },[type])

  const changeDaily = async(changedDate)=>{
    const receivedData = await changeFilter({variables:{
        id:token._id,
        date:changedDate.getTime().toString()
    }})
    setDay(changedDate)
    setTicketsPurchased(receivedData['data']['getBusCompanyDataWithParam']["ticketsPurchased"])
    setNumberOfTrips(receivedData['data']['getBusCompanyDataWithParam']["numberOfTrips"])
    setTotalEarnedAmount(receivedData['data']['getBusCompanyDataWithParam']["totalRevenue"])
  }

  const changeMonthly = async(changedDate)=>{
    const receivedData = await changeFilter({variables:{
      id:token._id,
      date:changedDate.toLocaleDateString("eng",{month:"long"})
    }})
    setMonth(changedDate.getTime())
    setTicketsPurchased(receivedData['data']['getBusCompanyDataWithParam']["ticketsPurchased"])
    setNumberOfTrips(receivedData['data']['getBusCompanyDataWithParam']["numberOfTrips"])
    setTotalEarnedAmount(receivedData['data']['getBusCompanyDataWithParam']["totalRevenue"])
  }

  const changeYearly = async(newYear)=>{    
    const receivedData = await changeFilter({variables:{
          id:token._id,
          date:newYear.toString()
    }})
    setYear(newYear)
    setTicketsPurchased(receivedData['data']['getBusCompanyDataWithParam']["ticketsPurchased"])
    setNumberOfTrips(receivedData['data']['getBusCompanyDataWithParam']["numberOfTrips"])
    setTotalEarnedAmount(receivedData['data']['getBusCompanyDataWithParam']["totalRevenue"])
  }

  const displayFilterData = ()=>{
    if(type==="Daily"){
      return new Date(new Date().toLocaleDateString()+" UTC").getTime()===day.getTime()?"Today":day.toLocaleDateString("eng",{weekday:"long"})+" "+day.getDate()+"-"+day.toLocaleDateString("eng",{month:"long"})
    }
    else if(type==="Monthly"){
      return new Date(month).toLocaleDateString("eng",{month:"long"})+" "+new Date(month).getFullYear();
    }
    return year;
  }

  const onForwardClicked = async()=>{
      if(type=="Daily"&&day.getTime()!==new Date(new Date().toLocaleDateString()+" UTC").getTime()){
        const changedDate = new Date(day.getTime())
        changedDate.setDate(changedDate.getDate()+1)
        changeDaily(changedDate)
      }
      else if(type==="Monthly"&&(new Date(month).toLocaleDateString("eng",{month:"long"})!==new Date().toLocaleDateString("eng",{month:"long"})&&new Date(month).getFullYear()===new Date().getFullYear())){
        const changedDate = new Date(`${new Date().getFullYear()}-${new Date(month).getMonth()+2}-1`)
        changeMonthly(changedDate)
      }
      else if(type==="Yearly"&&year!==new Date().getFullYear()){
        const newYear = year + 1;
        changeYearly(newYear)
      }
  }

  const onBackwardClicked = async()=>{
    if(type=="Daily"){
      const changedDate = new Date(day.getTime())
      changedDate.setDate(changedDate.getDate()-1)
      changeDaily(changedDate)
    }
    else if(type==="Monthly"){
      const changedDate = new Date(`${new Date().getFullYear()}-${new Date(month).getMonth()}-1`)
      changeMonthly(changedDate)
    }
    else if(type==="Yearly"){
      const newYear = year - 1;
      changeYearly(newYear)
    }
  }
  return (<ThemeProvider theme={customTheme}>
  <Box sx={{background:"#F5F5F5",height:"100vh"}}>
  <LocaleLanguage.Provider value={{locale,token}}>
    <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
    <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
    <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
    <Box sx={{ml:{md:"20vw"},pt:"0.7rem",fontFamily:"Open Sans",px:"0.5rem",overflowY:"scroll",background:"#F5F5F5",mb:"1rem"}}>
        <Toolbar/>
        <Typography variant="h4" sx={{ml:5,fontWeight:"700"}}>{translateWord(locale,"Dashboard")}</Typography>
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",ml:5}}>
          <Box sx={{display:"flex",alignItems:"center"}}>
            <Typography mr={2}>{translateWord(locale,displayFilterData())}</Typography>
            <IconButton onClick={onBackwardClicked}>
                <ArrowBackIos sx={{color:"#629460"}}/>
            </IconButton>
            <IconButton onClick={onForwardClicked}>
                <ArrowForwardIos sx={{color:"#629460"}}/>
            </IconButton>
          </Box>
          <DefaultSelectComponent value={type} setValue={setType} options={FILTERTYPES}/>
        </Box>
        <Box sx={{display:"flex",flexDirection:{md:"row",xs:"column"},justifyContent:"space-evenly",alignItems:"center"}}>
            <DetailCard label={translateWord(locale,"Tickets Purchased Today")} amount={ticketsPurchased} img={ticketImage}/>
            <DetailCard label={translateWord(locale,"Number of Trips")} amount={numberOfTrips} img={tripImage}/>
            <DetailCard label={translateWord(locale,"Total Earned Amount")} amount={totalEarnedAmount} img={paymentImage}/>
        </Box>
        <Box sx={{display:"flex",justifyContent:"center"}}>
            <CustomLineChart previousYearData={data["lastYearSoldTicket"]} currentYearData={data["thisYearSoldTicket"]}/>
        </Box>
    </Box>
    </LocaleLanguage.Provider>
    </Box>
    </ThemeProvider>
    )
}
export const getServerSideProps = async(ctx)=>{
  const {locale,req} = ctx
  const token = req["cookies"]['token']
  const nextLocale = req["cookies"]['NEXT_LOCALE']
    if(!token){
      return {
        redirect:{
          destination:"/",
          permanent: false
        }
      };
    }
    const tokenDecoded = jwt.verify(token,process.env.JWT_KEY)
    if(tokenDecoded.role!=="BUS COMPANY"&&tokenDecoded.role!=="TRIP MANAGER"){
        return {
          redirect:{
            destination:"/",
            permanent: false
          }
        };
    }
    let data;
    try{
      data = await client.query({
        query:gql`
        query getBusCompanyData($id:ID!){
          getBusCompanyData(id:$id){
            numberOfTrips
            ticketsPurchased
            totalRevenue
            lastYearSoldTicket
            thisYearSoldTicket
          }
        }`,variables:{
          id:tokenDecoded._id
        }
      })
    }
    catch(e){
      console.log(JSON.stringify(e))
    }
  return {
    props:{
      locale:nextLocale||locale,
      data:data["data"]["getBusCompanyData"],
      token:tokenDecoded
    }
  }
}