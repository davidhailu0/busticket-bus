import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import SideBar from "../components/sidebar"
import ManagementAppbar from "../components/ManagementAppbar"
import CustomTextField from "../components/CustomTextField"
import { LocaleLanguage } from "../utils/LanguageContext";
import { uploadFile } from "../utils/request-api";

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const Profile = ({locale,userData,role})=>{
    const [companyName,setCompanyName] = useState("Selam")
    const [companyNameError,setCompanyNameError] = useState(false)
    const [companyPhone,setCompanyPhone] = useState("0115556987")
    const [companyPhoneError,setCompanyPhoneError] = useState(false)
    const [companyEmail,setCompanyEmail] = useState("info@selam.et")
    const [companyEmailError,setCompanyEmailError] = useState(false)
    const [companyPassword,setCompanyPassword] = useState("Unchanged")
    const [companyPasswordError,setCompanyPasswordError] = useState(false)
    const [numberOfBus,setNumberOfBus] = useState("10")
    const [numberOfBusError,setNumberOfBusError] = useState(false)
    const [licenseName,setLicenseName] = useState("LicenseName")
    const [editFields,setEditFields] = useState(false)
    const [drawerState,setDrawerState] = useState(false) 

    const onButtonClicked = ()=>{
        if(!editFields){
            setEditFields(true)
        }
        else{

        }
    }

    const handleFileUpload = async(e)=>{
        if(e.target.files[0]){
            sessionStorage.setItem("busID")
            sessionStorage.setItem("busProvider")
            setLicenseName(e.target.files[0]["name"])
            await uploadFile(e.target.files[0],"LicenseFile")
        }
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={role}/>
        <SideBar drawerState={drawerState} role={role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:"2rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
        <Typography variant="h4" sx={{ml:5,fontWeight:"700"}}>Trip Manager</Typography>
        <Grid container spacing={2} pl={5} mt={0.5}>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Company Name</Typography>
                <CustomTextField value={companyName} setValue={setCompanyName} error={companyNameError} setError={setCompanyNameError} disabled={!editFields} placeholder={"Company Name"}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Company Phone</Typography>
                <CustomTextField value={companyPhone} setValue={setCompanyPhone} error={companyPhoneError} setError={setCompanyPhoneError} disabled={!editFields} placeholder={"Company Phone"}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Company Email</Typography>
                <CustomTextField value={companyEmail} setValue={setCompanyEmail} error={companyEmailError} setError={setCompanyEmailError} disabled={!editFields} placeholder={"Company Email"} type="email"/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Number of Buses</Typography>
                <CustomTextField value={numberOfBus} setValue={setNumberOfBus} error={numberOfBusError} setError={setNumberOfBusError} disabled={!editFields} placeholder={"Number of Buses"} type={"number"}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>License</Typography>
                <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"522px",height:"70px",background: "rgba(240, 240, 240, 1)",boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",px:"12px",border:"solid 1px rgba(240, 240, 240, 1)",borderRadius:"5px",my:"1rem"}}>
                    <Typography sx={{fontFamily:"Open Sans",color: "rgba(204, 204, 204, 1)"}}>{licenseName}</Typography>
                    <Button variant="outlined" component={"label"} disabled={!editFields}>Upload <input type={"file"} hidden onChange={handleFileUpload} name="LicenseFile" accept='application/pdf,image/*,application/msword'/></Button>
                </Box>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Company Password</Typography>
                <CustomTextField value={companyPassword} setValue={setCompanyPassword} error={companyPasswordError} setError={setCompanyPasswordError} disabled={!editFields} placeholder={"Company Password"} type="password"/>
            </Grid>
            <Grid item sx={{mb:"2rem"}}>
                <Button variant="contained" onClick={onButtonClicked} sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}}>{editFields?"Save":"Edit"}</Button>
            </Grid>
        </Grid>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    );
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,res} = ctx
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
    if(tokenDecoded.role!=="BUS COMPANY"){
        return {
            redirect:{
                destination:"/",
                permanent:false
            }
        };
    }
    return {
        props:{locale:nextLocale||locale}
    }
}

export default Profile