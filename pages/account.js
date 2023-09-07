import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import { useRouter } from "next/router"
import SideBar from "../components/sidebar"
import ManagementAppbar from "../components/ManagementAppbar"
import CustomTextField from "../components/CustomTextField"
import { gql,useMutation } from "@apollo/client"
import { LocaleLanguage } from "../utils/LanguageContext";
import { uploadFile } from "../utils/request-api";
import client from "../utils/ApolloServer"
import {validateEmail,validatePhone, validateNumber} from "../utils/validate"
import { useCookie } from "../utils/cookies"
import { translateWord } from "../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const MUTATEUPDATEBUSCOMPANY = gql`
 mutation updateBusCompany($id: ID!, $busCompany:BusCompanyUpdateInput!,$activity:CreateActivityLog){
    updateBusCompany(id: $id, busCompany:$busCompany,activity:$activity){
                name
                phoneNumber
                email
                password
                numberOfBuses
                license
                token
    }
 }`

const Account = ({locale,companyInfo,token,tokenDecoded})=>{
    const [companyName] = useState(companyInfo["name"])
    const [companyPhone,setCompanyPhone] = useState(companyInfo["phoneNumber"])
    const [companyPhoneError,setCompanyPhoneError] = useState(false)
    const [companyEmail,setCompanyEmail] = useState(companyInfo["email"])
    const [companyEmailError,setCompanyEmailError] = useState(false)
    const [companyPassword,setCompanyPassword] = useState("")
    const [companyPasswordError,setCompanyPasswordError] = useState(false)
    const [numberOfBus,setNumberOfBus] = useState(companyInfo["numberOfBuses"])
    const [numberOfBusError,setNumberOfBusError] = useState(false)
    const [licenseName,setLicenseName] = useState(companyInfo["license"])
    const [editFields,setEditFields] = useState(false)
    const [drawerState,setDrawerState] = useState(false) 
    const [updateBusCompany] = useMutation(MUTATEUPDATEBUSCOMPANY)
    const [getCookie,setCookie] = useCookie()

    const onButtonClicked = async()=>{
        if(!editFields){
            setEditFields(true)
        }
        else{
                const data = await updateBusCompany({variables:{
                    id:companyInfo["_id"],
                    busCompany:{
                        name: companyName,
                        phoneNumber: companyPhone,
                        email: companyEmail,
                        password:companyPassword,
                        license: licenseName,
                        numberOfBuses: parseInt(numberOfBus)
                    },
                    activity:{
                        companyId:companyInfo["_id"],
                        name:tokenDecoded.accountName
                    }
                }})
                setCompanyPhone(data["data"]["updateBusCompany"]["phoneNumber"])
                setCompanyEmail(data["data"]["updateBusCompany"]["email"])
                setNumberOfBus(data["data"]["updateBusCompany"]["numberOfBuses"])
                setLicenseName(data["data"]["updateBusCompany"]["license"])
                setEditFields(false)
        }
    }

    const handleFileUpload = async(e)=>{
        if(e.target.files[0]){
            sessionStorage.setItem("busID",companyInfo["_id"])
            sessionStorage.setItem("busProvider",companyInfo["name"])
            setLicenseName(e.target.files[0]["name"])
            await uploadFile(e.target.files[0],"LicenseFile",token)
        }
    }

    const handlePhoneChange = async(e)=>{
        setCompanyPhone(e.target.value)
        if(validatePhone(e.target.value)){
            setCompanyPhoneError(false)
        }
        else{
            setCompanyPhoneError(true)
        }
    }

    const handleEmailChange = (e)=>{
        setCompanyEmail(e.target.value)
        if(validateEmail(e.target.value)){
            setCompanyEmailError(false)
        }
        else{
            setCompanyEmailError(true)
        }
    }

    const handleNumberOfBusesChange = (e)=>{
        setNumberOfBus(e.target.value)
        if(validateNumber(e.target.value)){
            setNumberOfBusError(false)
        }
        else{
            setNumberOfBusError(true)
        }
    }

    const handlePasswordChange = (e)=>{
        setCompanyPassword(e.target.value)
        if(validateNumber(e.target.value)){
            setNumberOfBusError(false)
        }
        else{
            setNumberOfBusError(true)
        }
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token:tokenDecoded}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={tokenDecoded.role}/>
        <SideBar companyName={companyInfo["name"]} drawerState={drawerState} role={tokenDecoded.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:"1rem",background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
        <Typography variant="h4" sx={{ml:{md:5,xs:3},fontWeight:"700"}}>{translateWord(locale,"Account")}</Typography>
        <Grid container spacing={2} sx={{pl:{md:5,xs:3}}} mt={0.5}>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <CustomTextField value={companyName} disabled={!editFields} placeholder={translateWord(locale,"Company Name")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={companyPhone} setValue={handlePhoneChange} error={companyPhoneError} setError={setCompanyPhoneError} disabled={!editFields} placeholder={translateWord(locale,"Company Phone Number")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={companyEmail} setValue={handleEmailChange} error={companyEmailError} setError={setCompanyEmailError} disabled={!editFields} placeholder={translateWord(locale,"Company Email")} type="email"/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={numberOfBus} setValue={handleNumberOfBusesChange} error={numberOfBusError} setError={setNumberOfBusError} disabled={!editFields} placeholder={translateWord(locale,"Number of Buses")} type={"number"}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"License")}</Typography>
                <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"522px",height:"70px",background: "rgba(240, 240, 240, 1)",boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",px:"12px",border:"solid 1px rgba(240, 240, 240, 1)",borderRadius:"5px",my:"1rem"}}>
                    <Typography sx={{fontFamily:"Open Sans",color: "rgba(204, 204, 204, 1)"}}>{licenseName}</Typography>
                    <Button variant="outlined" component={"label"} disabled={!editFields}>{translateWord(locale,"Upload")} <input type={"file"} hidden onChange={handleFileUpload} name="LicenseFile" accept='application/pdf,image/*,application/msword'/></Button>
                </Box>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={companyPassword} setValue={handlePasswordChange} error={companyPasswordError} setError={setCompanyPasswordError} disabled={!editFields} placeholder={"Password If Changed"} type="password"/>
            </Grid>
            <Grid item sx={{mb:"2rem"}}>
                <Button variant="contained" onClick={onButtonClicked} sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}}>{editFields?translateWord(locale,"Save"):translateWord(locale,"Edit")}</Button>
            </Grid>
        </Grid>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    );
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
                permanent:false
            }
        };
    }
    const data = await client.query({
        query:gql`
        query busCompany($id:ID!){
            busCompany(id:$id){
                _id
                name
                phoneNumber
                email
                password
                numberOfBuses
                license
            }
        }`,variables:{
            id:tokenDecoded._id
        }
    })
    return {
        props:{locale:nextLocale||locale,
            companyInfo:data["data"]["busCompany"],
            token,
            tokenDecoded
        }
    }
}

export default Account