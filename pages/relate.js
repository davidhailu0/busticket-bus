import { useEffect, useState } from "react"
import { Box,Toolbar, Typography } from "@mui/material"
import jwt from "jsonwebtoken"
import { gql } from "@apollo/client"
import {createTheme,ThemeProvider} from "@mui/material"
import ManagementAppbar from "../components/ManagementAppbar"
import SideBar from "../components/sidebar"
import { LocaleLanguage } from "../utils/LanguageContext"
import client from "../utils/ApolloServer"
import BusBox from "../components/busBox"
import DriverAssignModal from "../components/AssignDriverModal"
import { translateWord } from "../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#629460",
        },
    }
})


export default function Relation({locale,data,allDrivers,token}) {
  const [drawerState,setDrawerState] = useState(false) 
  const [openAssignModal,setOpenAssignModal] = useState(false)
  const [bus,setBus] = useState(null)

  useEffect(()=>{
    if(bus!==null){
        setOpenAssignModal(true)
    }
  },[bus])

  return (<ThemeProvider theme={customTheme}>
  <Box sx={{background:"#F5F5F5",height:"100vh"}}>
  <LocaleLanguage.Provider value={{locale,token}}>
    <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
    <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
    <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
    <Box sx={{ml:{md:"20vw"},pt:"0.7rem",fontFamily:"Open Sans",px:"0.5rem",overflowY:"scroll",background:"#F5F5F5",mb:"1rem",pl:5}}>
        <Toolbar/>
        <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Match")}</Typography>
        <Typography sx={{color:"#CCCCCC",fontWeight:700,fontSize:"20px",my:"1rem"}}>{translateWord(locale,"Match Bus and Driver")}</Typography>
        <Box sx={{display:"grid",gridTemplateColumns:{md:"auto auto auto",xs:"auto"},alignItems:"center",justifyContent:{md:"start",xs:"center"}}}>
          {data.map(({_id,plateNumber,driver})=><BusBox key={_id} plateNumber={plateNumber} driverName={driver?driver["name"]:translateWord(locale,"Unassigned")} onClick={()=>setBus({plateNumber,_id,driver:driver?driver:"Unassigned"})}/>)}
        </Box>
        <DriverAssignModal open={openAssignModal} setOpen={setOpenAssignModal} bus={bus} allDrivers={allDrivers}/>
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

    const data = await client.query({
        query:gql`
        query allBusesOfTheCompany($busCompanyID:ID!){
            allBusesOfTheCompany(busID:$busCompanyID){
                _id
                plateNumber
                driver{
                  _id
                  name
                  assignedTo{
                    plateNumber
                  }
                }
            }
        }`,variables:{
            busCompanyID:tokenDecoded._id
        }
})
const allDriver = await client.query({
    query:gql`
    query allDrivers($busCompanyID:ID!){
        allDrivers(busCompanyID:$busCompanyID){
            _id
            name
            assignedTo{
              plateNumber
            }
        }
    }`,variables:{
        busCompanyID:tokenDecoded._id
    }
})
  let unAssignedBusCompany = data["data"]["allBusesOfTheCompany"].filter((obj)=>!obj["driver"])
  let assignedBusCompany = data["data"]["allBusesOfTheCompany"].filter((obj)=>obj["driver"])
  let busCompanyDataSorted = [...unAssignedBusCompany,...assignedBusCompany]
  return {
    props:{
      locale:nextLocale||locale,
      data:busCompanyDataSorted,
      allDrivers:allDriver["data"]["allDrivers"],
      token:tokenDecoded
    }
  }
}