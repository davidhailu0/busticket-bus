import { useState,useEffect } from "react";
import { Box,Typography,ThemeProvider,createTheme, Button} from "@mui/material";
import jwt from "jsonwebtoken"
import { useRouter } from "next/router";
import { gql,useMutation } from "@apollo/client";
import ManagementAppbar from "../../components/ManagementAppbar"
import RouteBox from "../../components/routeBox";
import SideBar from "../../components/sidebar";
import { LocaleLanguage } from "../../utils/LanguageContext";
import client from "../../utils/ApolloServer";
import RouteDisplayDialog from "../../components/routeDisplayModal";
import { NumberOfBusContext} from "../../utils/numberOfBusesContext";
import { translateWord } from "../../utils/languageTranslation";

const MUTATEBUSCOMPANYUPDATE = gql`
    mutation updateBusCompany($inputID: ID!, $inputBusCompany:BusCompanyUpdateInput!,$activity:CreateActivityLog){
        updateBusCompany(id: $inputID, busCompany:$inputBusCompany,activity:$activity){
            _id
            name
            phoneNumber
            email
        }
    }
`

const customTheme = createTheme({
        palette:{
            primary:{
               main:"#629460" 
            }
        }
})

const Routes= ({locale,routes,allRoutesArray,token})=>{
    // const [loading,setLoading] = useState(false)
    const [drawerState,setDrawerState] = useState(false) 
    const router = useRouter()
    const [openDialogue,setOpenDialogue] = useState(false)
    const [selectedCheckBox,setSelectedCheckBox] = useState(allRoutesArray.map(({_id})=>_id))
    // updateBusCompany
    const [selectedDestinations,setSelectedDestinations] = useState({})
    const [updateBusCompany] = useMutation(MUTATEBUSCOMPANYUPDATE)

    useEffect(()=>{
        if(Object.keys(selectedDestinations).length!==0){
            setOpenDialogue(true)
        }
    },[selectedDestinations])

    const goToAddNewRoute = ()=>{
        router.push("routeAddPage")
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"6rem",px:"0.7rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
            <Box sx={{ml:5,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Routes")}</Typography>
                <Button variant="outlined" sx={{textTransform:"none"}} onClick={goToAddNewRoute}>{translateWord(locale,"Add Route")}</Button>
            </Box>
            <Box mt={2} ml={5} sx={{display:"grid",gridTemplateColumns:{md:"auto auto auto",xs:"auto"},justifyContent:{md:"start",xs:"center"},gap:5}}>
                {Object.keys(routes).map((ky)=>{
                    let count = 0
                    for(let rtID of allRoutesArray.map(({_id})=>_id)){
                        if(routes[ky].find(obj=>obj._id===rtID)){
                            count++;
                        }
                    }
                    return <RouteBox key={ky} destination={ky} numberSelected={count} onClick={()=>setSelectedDestinations({[ky]:routes[ky]})}/>
                })}
            </Box>
        </Box>
        <NumberOfBusContext.Provider value={{selectedCheckBox,updateBusCompany,setSelectedCheckBox,setSelectedDestinations,selectedDestinations,id:token._id}}>
            <RouteDisplayDialog open={openDialogue} setOpen={setOpenDialogue}/>
        </NumberOfBusContext.Provider>
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
        const routes = await client.query({
            query:gql`
            query allRoutesOfBusCompany($busCompanyId:ID!){
                allRoutesOfBusCompany(busCompanyId:$busCompanyId){
                    _id
                    departure
                    destination
                    subRoutes{
                        _id
                        departure
                        destination
                        subRoutes{
                            _id
                            destination
                            departure
                        }
                    }
                }
            }`,variables:{
                busCompanyId:tokenDecoded._id
            }
        })
        const categorizedRoutes = {}
        for(let rt of routes["data"]["allRoutesOfBusCompany"]){
            if(rt["subRoutes"].length===0){
                const foundedInSubroute = routes["data"]["allRoutesOfBusCompany"].find(({subRoutes})=>subRoutes.find(({destination})=>rt["destination"]===destination))
                if(foundedInSubroute){
                    if(categorizedRoutes[foundedInSubroute["destination"]]){
                        categorizedRoutes[foundedInSubroute["destination"]] = [...categorizedRoutes[foundedInSubroute["destination"]],rt]
                    }
                    else{
                        categorizedRoutes[foundedInSubroute["destination"]] = [rt]
                    }
                }
                else{
                    categorizedRoutes[rt["destination"]] = [rt]
                }
            }
            else{
                const foundedInSubroute = routes["data"]["allRoutesOfBusCompany"].find(({subRoutes})=>subRoutes.find(({destination})=>rt["subRoutes"][0]["destination"]===destination))
                if(foundedInSubroute["subRoutes"].length>rt["subRoutes"].length){
                    categorizedRoutes[foundedInSubroute["destination"]] = [...foundedInSubroute["subRoutes"],foundedInSubroute]
                    if(foundedInSubroute["destination"]!==rt["destination"]){
                        delete categorizedRoutes[rt["destination"]]
                    }
                }
                else{
                    categorizedRoutes[rt["destination"]] = [...rt["subRoutes"],rt]
                    if(foundedInSubroute["destination"]!==rt["destination"]){
                        delete categorizedRoutes[foundedInSubroute["destination"]]
                    }
                }
            }
        }
        let newObj = {}
        Object.assign(newObj,categorizedRoutes)
        Object.keys(categorizedRoutes).map((ky)=>{
            delete newObj[ky]
            const foundedOther = Object.values(newObj).findIndex(arr=>arr.find(obj=>obj["destination"]===ky))
            if(foundedOther>=0){
                delete categorizedRoutes[ky]
            }
            Object.assign(newObj,categorizedRoutes)
        })
        console.log(routes["data"]["allRoutesOfBusCompany"])
    return {
        props:{locale:nextLocale||locale,
            routes:categorizedRoutes,
            allRoutesArray:routes["data"]["allRoutesOfBusCompany"]||[],
            token:tokenDecoded
        }
    }
}
export default Routes;