import { useState } from "react";
import { Box,Typography,ThemeProvider,createTheme,Button} from "@mui/material";
import jwt from "jsonwebtoken"
import { useRouter } from "next/router";
import { ClimbingBoxLoader } from "react-spinners";
import { css } from "@emotion/react";
import ManagementAppbar from "../../components/ManagementAppbar"
import { Add } from "@mui/icons-material";
import { gql } from "@apollo/client";
import SideBar from "../../components/sidebar";
import { LocaleLanguage } from "../../utils/LanguageContext";
import client from "../../utils/ApolloServer";
import BusPlateNumber from "../../components/busBox/busPlateNumber";
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

const Buses= ({locale,buses,token})=>{
    const [loading,setLoading] = useState(false)
    const [drawerState,setDrawerState] = useState(false) 
    const router = useRouter()
    console.log(token)

    const goToAddBusPage = ()=>{
        router.push("buses/addBus")
    }
    
    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <ClimbingBoxLoader color={'#36D7B7'}loading={loading} css={override} height={150} width={10} margin={3}/>
        <Box sx={{ml:{md:"20vw"},pt:"6rem",px:"0.7rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
            <Box sx={{ml:{md:5,xs:3},display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <Box sx={{display:"flex",alignItems:"center"}}>
                    <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Buses")}</Typography>
                    <Typography sx={{color:"#ccc",ml:"1rem"}}>({buses.length} {translateWord(locale,"Bus")})</Typography>
                </Box>
                <Button variant="outlined" sx={{textTransform:"none"}} onClick={goToAddBusPage}>{translateWord(locale,"Add New Bus")}</Button>
            </Box>
            <Box mt={2} ml={5} sx={{display:buses.length!==0?"grid":"none",gridTemplateColumns:{md:"auto auto auto",xs:"auto"},gap:"5rem",justifyContent:{md:"start",xs:"center"}}}>
                {buses.map(({plateNumber,_id},ind)=><BusPlateNumber key={_id} ind={ind} plateNumber={plateNumber} onClick={()=>router.push(`buses/${_id}`)}/>)}
            </Box>
            <Box sx={{display:buses.length===0?"flex":"none",justifyContent:"center",alignItems:"center",height:"70vh",}}>
                <Box>
                    <Typography textAlign={"center"} color="#CCCCCC">{translateWord(locale,"No Bus added so far")}</Typography>
                    <Box onClick={goToAddBusPage} sx={{mt:"2rem",width:"217px",display:"flex",justifyContent:"center",alignItems:"center",height:"150px",boxShadow: "0px 0px 10px 0px #00000026",":hover":{cursor:"pointer"}}}>
                        <Add fontSize="large" sx={{height:"59px",width:"59px",color:"#CCCCCC"}}/>
                    </Box>
                </Box>
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
    return {
        props:{locale:nextLocale||locale,
            buses:data["data"]["allBusesOfTheCompany"],
            token:tokenDecoded
        }
    }
}
export default Buses;