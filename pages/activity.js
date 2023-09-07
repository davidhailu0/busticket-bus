import { useState } from "react"
import { Box,Toolbar, Typography } from "@mui/material"
import jwt from "jsonwebtoken"
import { gql } from "@apollo/client"
import ManagementAppbar from "../components/ManagementAppbar"
import SideBar from "../components/sidebar"
import { LocaleLanguage } from "../utils/LanguageContext"
import client from "../utils/ApolloServer"
import DataTable from "../components/dataTable"
import { translateWord } from "../utils/languageTranslation"

export default function Home({locale,data,token}) {
  const [drawerState,setDrawerState] = useState(false) 
  return (<Box sx={{background:"#F5F5F5",height:"auto"}}>
  <LocaleLanguage.Provider value={{locale,token}}>
    <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
    <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
    <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
    <Box sx={{ml:{md:"20vw"},pt:"0.7rem",height:"auto",fontFamily:"Open Sans",px:"0.5rem",overflowY:"hidden",background:"#F5F5F5",mb:"1rem"}}>
        <Toolbar/>
        <Typography variant="h4" sx={{ml:5,fontWeight:"700"}}>{translateWord(locale,"Activity Logs")}</Typography>
        <DataTable activityLogs={data}/>
    </Box>
    </LocaleLanguage.Provider>
    </Box>
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
      query activityLogs($companyId:ID!){
        activityLogs(companyId:$companyId){
          name
          activity
          time
        }
      }`,variables:{
        companyId:tokenDecoded._id
      }
    })
  return {
    props:{
      locale:nextLocale||locale,
      data:data["data"]["activityLogs"],
      token:tokenDecoded
    }
  }
}