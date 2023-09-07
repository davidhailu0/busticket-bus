import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import { useRouter } from "next/router"
import DatePicker from "../../components/datePicker2"
import SideBar from "../../components/sidebar"
import ManagementAppbar from "../../components/ManagementAppbar"
import CustomTextField from "../../components/CustomTextField"
import { LocaleLanguage } from "../../utils/LanguageContext";
import SelectComponent from "../../components/SelectBox/customSelect"
import CustomSwitch from "../../components/switch"
import client from "../../utils/ApolloServer"
import { gql,useMutation } from "@apollo/client"
import CustomMultiSelect from "../../components/multiSelect/customMultiSelect"
import { validateName, validateNumber, validatePhone,validatePassword } from "../../utils/validate"
import { translateWord } from "../../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const ROLES = ["DRIVER","DRIVER ASSISTANT","TRIP MANAGER"]
const LICENSETYPES = ["Level 5","Hizib 3"]
const LANGUAGES = ["Amharic","English"]


const MUTATEUPDATEEMPLOYEE = gql`
mutation updateEmployee($employeeId:ID!,$employeeInfo:UpdateEmployee!,$activity:CreateActivityLog){
    updateEmployee(employeeId:$employeeId,employeeInfo:$employeeInfo,activity:$activity){
        name
        phoneNumber
        busCompany
        address
        role
        password
        emergencyContactName
        emergencyContactPhone
        suretyName
        suretyPhone
        status
        languages
        licenseType
        licenseID
        licenseExpiryDate
    }
}`

const Employees = ({locale,employeeId,employeeInfo,token})=>{
    const [employeeName,setEmployeeName] = useState(employeeInfo["name"])
    const [employeeNameError,setEmployeeNameError] = useState(false)
    const [employeeRole,setEmployeeRole] = useState(employeeInfo["role"])
    const [employeeRoleError,setEmployeeRoleError] = useState(false)
    const [password,setPassword] = useState("Unchanged")
    const [passwordError,setPasswordError] = useState(false)
    const [emergencyName,setEmergencyname] = useState(employeeInfo["emergencyContactName"]||"")
    const [emergencyNameError,setEmergencynameError] = useState(false)
    const [emergencyPhone,setEmergencyPhone] = useState(employeeInfo["emergencyContactPhone"]||"")
    const [emergencyPhoneError,setEmergencyPhoneError] = useState(false)
    const [guarantorName,setGuarantorName] = useState(employeeInfo["suretyName"]||"")
    const [guarantorNameError,setGuarantorNameError] = useState(false)
    const [guarantorPhone,setGuarantorPhone] = useState(employeeInfo["suretyPhone"]||"")
    const [guarantorPhoneError,setGuarantorPhoneError] = useState(false)
    const [employeePhone1,setEmployeePhone1] = useState(employeeInfo["phoneNumber"][0]||"")
    const [employeePhoneError1,setEmployeePhoneError1] = useState(false)
    const [employeePhone2,setEmployeePhone2] = useState(employeeInfo["phoneNumber"].length===2&&employeeInfo["phoneNumber"][1]?employeeInfo["phoneNumber"][1]:"")
    const [employeePhoneError2,setEmployeePhoneError2] = useState(false)
    const [employeeAddress,setEmployeeAddress] = useState(employeeInfo["address"]||"")
    const [employeeAddressError,setEmployeeAddressError] = useState(false)
    const [employeeLicenseType,setEmployeeLicenseType] = useState(employeeInfo["licenseType"]||"")
    const [employeeLicenseTypeError,setEmployeeLicenseTypeError] = useState(false)
    const [employeeLicense,setEmployeeLicense] = useState(employeeInfo["licenseID"]||"")
    const [employeeLicenseError,setEmployeeLicenseError] = useState(false)
    const [employeeLicenseExpiry,setEmployeeLicenseExpiry] = useState(new Date(parseInt(employeeInfo["licenseExpiryDate"])))
    const [employeeLicenseExpiryError,setEmployeeLicenseExpiryError] = useState(false)
    const [employeeStatus,setEmployeeStatus] = useState(employeeInfo["status"])
    const [drawerState,setDrawerState] = useState(false) 
    const [selectedLanguages,setSelectedLanguage] = useState(employeeInfo["languages"])
    const [selectedLanguageError,setSelectedLanguageError] = useState(false)
    const [otherLanguage,setOtherLanguage] = useState([])
    const [updateEmployee] = useMutation(MUTATEUPDATEEMPLOYEE)
    const [editFields,setEditFields] = useState(false)
    const router = useRouter()

    const onButtonClicked = async()=>{
        if(!editFields){
            setEditFields(true)
        }
        else{
            if(validateInputs()){
                let selectedLangs;
                if(!selectedLanguages.includes("Other")){
                    selectedLangs = selectedLanguages
                }
                else{
                    selectedLangs = [...selectedLanguages.filter(ln=>ln!=="Other"),...otherLanguage]
                }
                await updateEmployee({
                    variables:{
                        employeeId:employeeId,
                        employeeInfo:{
                            address:employeeAddress,
                            role:employeeRole,
                            password:password,
                            status:employeeStatus,
                            licenseType:employeeLicenseType,
                            licenseID:employeeLicense,
                            languages:selectedLangs,
                            licenseExpiryDate:(employeeLicenseExpiry!="Invalid Date"&&employeeLicenseExpiry.getTime().toString())||"",
                        },
                        activity:{
                            companyId:token._id,
                            name:token.accountName
                        }
                    }
                })
                router.reload()
            }
        }
    }


    const validateInputs = ()=>{
        let returnedValue = true
        if(employeeName===""||employeeNameError){
            setEmployeeNameError(true)
            returnedValue = false
        }
        if(employeePhone1===""||employeePhoneError1){
            setEmployeePhoneError1(true)
            returnedValue = false
        }
        if(employeeAddress===""||employeeAddressError){
            setEmployeeAddressError(true)
            returnedValue = false
        }
        if(employeeRole===""||employeeRoleError){
            setEmployeeRoleError(true)
            returnedValue = false
        }
        if(selectedLanguages.length===0||selectedLanguageError){
            setSelectedLanguageError(true)
            returnedValue = false
        }
        if(employeeRole==="DRIVER"){
            if(employeeLicense===""||employeeLicenseError){
                console.log("license")
                setEmployeeLicenseError(true)
                returnedValue = false
            }
            if(employeeLicenseExpiry===""||employeeLicenseError){
                console.log("licenseExpiry")
                setEmployeeLicenseExpiryError(true)
                returnedValue = false
            }
            if(emergencyName===""||emergencyNameError){
                console.log("emergencyName")
                setEmergencynameError(true)
                returnedValue = false
            }
            if(emergencyPhone===""||emergencyPhoneError){
                setEmergencynameError(true)
                returnedValue = false
            }
            if(guarantorName===""||guarantorNameError){
                setGuarantorNameError(true)
                returnedValue = false
            }
            if(guarantorPhone===""||guarantorPhoneError){
                setGuarantorPhoneError(true)
                returnedValue = false
            }
        }
        if(employeeRole==="DRIVER ASSISTANT"){
            if(emergencyName===""||emergencyNameError){
                setEmergencynameError(true)
                returnedValue = false
            }
            if(emergencyPhone===""||emergencyPhoneError){
                setEmergencynameError(true)
                returnedValue = false
            }
            if(guarantorName===""||guarantorNameError){
                setGuarantorNameError(true)
                returnedValue = false
            }
            if(guarantorPhone===""||guarantorPhoneError){
                setGuarantorPhoneError(true)
                returnedValue = false
            }
        }
        if(employeeRole==="TRIP MANAGER"){
            if(password===""||passwordError){
                setPasswordError(true)
                returnedValue = false
            }
            else{
                setPasswordError(false)
            }
        }
        return returnedValue
    }

    const handleEmployeeNameChange = (e)=>{
        setEmployeeName(e.target.value)
        if(validateName(e.target.value)){
            setEmployeeNameError(false)
        }
        else{
            setEmployeeNameError(true)
        }
    }

    const handleOtherLanguageChange = (e)=>{
        setOtherLanguage(e.target.value.split(","))
    }

    const handlePasswordChange = (e)=>{
        setPassword(e.target.value)
        if(validatePassword(e.target.value)){
            setPasswordError(false)
        }
        else{
            setPasswordError(true)
        }
    }

    const handlePhoneChange1 = (e)=>{
            setEmployeePhone1(e.target.value)
            if(validatePhone(e.target.value)){
                setEmployeePhoneError1(false)
            }
            else{
                setEmployeePhoneError1(true)
            }
    }

    const handlePhoneChange2 = (e)=>{
        setEmployeePhone2(e.target.value)
        if(validatePhone(e.target.value)){
            setEmployeePhoneError1(false)
        }
        else{
            setEmployeePhoneError2(true)
        }
    }

    const handleAddressChange = (e)=>{
        setEmployeeAddress(e.target.value)
        if(e.target.value===""){
            setEmployeeAddressError(true)
        }
        else{
            setEmployeeAddressError(false)
        }
    }

    const handleEmployeeLicenseChange = (e)=>{
        setEmployeeLicense(e.target.value)
        if(validateNumber(e.target.value)&&e.target.value.length===6){
            setEmployeeLicenseError(false)
        }
        else{
            setEmployeeLicenseError(true)
        }
    }

    const handleEmergencyName = (e)=>{
        setEmergencyname(e.target.value)
        if(validateName(e.target.value)){
            setEmergencynameError(false)
        }
        else{
            setEmergencyPhoneError(true)
        }
    }

    const handleEmergencyPhone = (e)=>{
        setEmergencyPhone(e.target.value)
        if(validatePhone(e.target.value)){
            setEmergencyPhoneError(false)
        }
        else{
            setEmergencyPhoneError(true)
        }
    }

    const handleGuarantorNameChange = (e)=>{
        setGuarantorName(e.target.value)
        if(validateName(e.target.value)){
            setGuarantorNameError(false)
        }
        else{
            setGuarantorNameError(true)
        }
    }

    const handleGuarantorPhoneChange = (e)=>{
        setGuarantorPhone(e.target.value)
        if(validatePhone(e.target.value)){
            setGuarantorPhoneError(false)
        }
        else{
            setGuarantorPhoneError(true)
        }
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:"1rem",background:"#F5F5F5",height:"100vh",mb:"1rem",pl:{md:5,xs:3}}}>
        <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Staff")}</Typography>
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <Typography sx={{fontWeight:"700",color:"#CCCCCC",fontSize:"20px",mt:"1rem"}}>{translateWord(locale,"Edit Employee Information")}</Typography>
            <CustomSwitch label={employeeStatus?"Active":"Inactive"} value={employeeStatus} setValue={setEmployeeStatus} disabled={!editFields}/>
        </Box>
        <Grid container spacing={2} mt={0.5}>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <CustomTextField value={employeeName} setValue={handleEmployeeNameChange} error={employeeNameError} placeholder={translateWord(locale,"Name")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Choose Role")}</Typography>
                <SelectComponent label={translateWord(locale,"Role")} value={employeeRole} setValue={setEmployeeRole} options={ROLES} disabled={!editFields} error={employeeRoleError} setError={setEmployeeRoleError}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="TRIP MANAGER"?"block":"none"}}>
                <CustomTextField value={password} setValue={handlePasswordChange} error={passwordError} placeholder={translateWord(locale,"Password")} disabled={!editFields||employeeInfo["name"]!==token.accountName} type={"password"}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={employeePhone1} setValue={handlePhoneChange1} error={employeePhoneError1} placeholder={translateWord(locale,"Phone Number")+" 1"} disabled={!editFields}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={employeePhone2} setValue={handlePhoneChange2} error={employeePhoneError2} placeholder={translateWord(locale,"Phone Number")+" 2"} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"License Type")}</Typography>
                <SelectComponent label={"License Type"} value={employeeLicenseType} setValue={setEmployeeLicenseType} error={employeeLicenseTypeError} setError={setEmployeeLicenseTypeError} options={LICENSETYPES} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <CustomTextField value={employeeLicense} setValue={handleEmployeeLicenseChange} error={employeeLicenseError} placeholder={translateWord(locale,"License ID")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"License Expiry Date")}</Typography>
                <DatePicker value={employeeLicenseExpiry} setDateValue={setEmployeeLicenseExpiry} error={employeeLicenseExpiryError} setError={setEmployeeLicenseExpiryError} disabled={!editFields}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={employeeAddress} setValue={handleAddressChange} error={employeeAddressError} placeholder={translateWord(locale,"Address")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <CustomTextField value={emergencyName} setValue={handleEmergencyName} error={emergencyNameError} placeholder={translateWord(locale,"Emergency Responder Name")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <CustomTextField value={emergencyPhone} setValue={handleEmergencyPhone} error={emergencyPhoneError} placeholder={translateWord(locale,"Emergency Responder Phone")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <CustomTextField value={guarantorName} setValue={handleGuarantorNameChange} error={guarantorNameError} placeholder={translateWord(locale,"Guarantor Name")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <CustomTextField value={guarantorPhone} setValue={handleGuarantorPhoneChange} error={guarantorPhoneError} placeholder={translateWord(locale,"Guarantor Phone")} disabled={!editFields}/>
            </Grid>
            <Grid item md={12} sx={{display:editFields?"none":"block"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Languages")}</Typography>
                <CustomMultiSelect selectedFeatures={selectedLanguages} setFeatures={setSelectedLanguage} features={LANGUAGES} error={selectedLanguageError} disabled={!editFields} setError={setSelectedLanguageError}/>
            </Grid>
            <Grid item md={12} sx={{display:selectedLanguages.includes("Other")?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Add Other Languages, Separate them by Comma")}</Typography>
                <CustomTextField value={otherLanguage.join(",")} setValue={handleOtherLanguageChange} placeholder={"Add Other Languages"}/>
            </Grid>
            <Grid item sx={{mb:"1rem"}}>
                <Button variant="contained" onClick={onButtonClicked} sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}}>{editFields?translateWord(locale,"Save"):translateWord(locale,"Edit")}</Button>
            </Grid>
        </Grid>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    );
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,params} = ctx
    const token = req["cookies"]['token']
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    const {employeeID} = params
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
        query employee($employeeId:ID!){
            employee(employeeId:$employeeId){
                name
                phoneNumber
                busCompany
                address
                role
                password
                emergencyContactName
                emergencyContactPhone
                suretyName
                suretyPhone
                status
                languages
                licenseType
                licenseID
                licenseExpiryDate
            }
        }`,variables:{
            employeeId:employeeID
        }
    })
    return {
        props:{locale:nextLocale||locale,
            employeeInfo:data["data"]["employee"],
            employeeId:employeeID,
            token:tokenDecoded
        }
    }
}

export default Employees