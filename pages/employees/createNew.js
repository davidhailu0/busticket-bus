import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import {gql,useMutation} from "@apollo/client"
import SideBar from "../../components/sidebar"
import { useRouter } from "next/router"
import { ToastContainer,toast } from "react-toastify"
import ManagementAppbar from "../../components/ManagementAppbar"
import CustomTextField from "../../components/CustomTextField"
import { LocaleLanguage } from "../../utils/LanguageContext";
import SelectComponent from "../../components/SelectBox/customSelect"
import DatePicker from "../../components/datePicker2"
import CustomMultiSelect from "../../components/multiSelect/customMultiSelect"
import { validateName,validatePhone,validateNumber, validatePassword } from "../../utils/validate"
import { uploadFile } from "../../utils/request-api"
import { translateWord } from "../../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const MUTATEADDEMPLOYEE = gql`
mutation addEmployee($employeeInfo:AddNewEmployee!,$activity:CreateActivityLog){
    addEmployee(employeeInfo:$employeeInfo,activity:$activity){
        name
        phoneNumber
    }
}`

const ROLES = ["DRIVER","DRIVER ASSISTANT","TRIP MANAGER"]
const LICENSETYPES = ["Level 5","Hizib 3"]
const LANGUAGES = ["Amharic","English","Other"]

const Employees = ({locale,token,tokenRaw})=>{
    const [employeeName,setEmployeeName] = useState("")
    const [employeeNameError,setEmployeeNameError] = useState(false)
    const [employeeRole,setEmployeeRole] = useState("")
    const [employeeRoleError,setEmployeeRoleError] = useState(false)
    const [emergencyName,setEmergencyname] = useState("")
    const [emergencyNameError,setEmergencynameError] = useState(false)
    const [emergencyPhone,setEmergencyPhone] = useState("")
    const [emergencyPhoneError,setEmergencyPhoneError] = useState(false)
    const [guarantorName,setGuarantorName] = useState("")
    const [guarantorNameError,setGuarantorNameError] = useState(false)
    const [guarantorPhone,setGuarantorPhone] = useState("")
    const [guarantorPhoneError,setGuarantorPhoneError] = useState(false)
    const [selectedLanguages,setSelectedLanguage] = useState([])
    const [selectedLanguageError,setSelectedLanguageError] = useState(false)
    const [employeePhone1,setEmployeePhone1] = useState("")
    const [employeePhoneError1,setEmployeePhoneError1] = useState(false)
    const [employeePhone2,setEmployeePhone2] = useState(null)
    const [employeePhoneError2,setEmployeePhoneError2] = useState(false)
    const [employeeAddress,setEmployeeAddress] = useState("")
    const [employeeAddressError,setEmployeeAddressError] = useState(false)
    const [employeeLicenseType,setEmployeeLicenseType] = useState("")
    const [employeeLicenseTypeError,setEmployeeLicenseTypeError] = useState(false)
    const [employeeLicense,setEmployeeLicense] = useState("")
    const [employeeLicenseError,setEmployeeLicenseError] = useState(false)
    const [employeeLicenseExpiry,setEmployeeLicenseExpiry] = useState("")
    const [employeeLicenseExpiryError,setEmployeeLicenseExpiryError] = useState(false)
    const [employeeLicensePhoto,setEmployeeLicensePhoto] = useState(null)
    const [employeeLicensePhotoError,setEmployeeLicensePhotoError] = useState(false)
    const [otherLanguage,setOtherLanguage] = useState([])
    const [drawerState,setDrawerState] = useState(false) 
    const [password,setPassword] = useState("")
    const [passwordError,setPasswordError] = useState(false)
    const [addEmployee] = useMutation(MUTATEADDEMPLOYEE)
    const router = useRouter()

    const handleUploadFile = async(e,type)=>{
        if(e.target.files[0]){
                setEmployeeLicensePhotoError(false)
                setEmployeeLicensePhoto(e.target.files[0])
        }
        else if(!employeeLicensePhoto){
                setEmployeeLicensePhotoError(true)
        }
    }

    const addEmployeeButtonClicked = async()=>{
        if(validateInputs()){
            sessionStorage.setItem("busID",token._id)
            sessionStorage.setItem("busProvider",employeeName)
            await uploadFile(employeeLicensePhoto,"DriverLicense",tokenRaw)
            let selectedLangs;
            if(!selectedLanguages.includes("Other")){
                selectedLangs = selectedLanguages
            }
            else{
                selectedLangs = [...selectedLanguages.filter(ln=>ln!=="Other"),...otherLanguage]
            }
            try{
            await addEmployee({variables:{
                employeeInfo:{
                    name:employeeName,
                    phoneNumber:[employeePhone1,employeePhone2],
                    busCompany:token._id,
                    address:employeeAddress,
                    role:employeeRole,
                    password:password||null,
                    emergencyContactName:emergencyName,
                    emergencyContactPhone:emergencyPhone,
                    suretyName:guarantorName,
                    suretyPhone:guarantorPhone,
                    languages:selectedLangs,
                    licenseType:employeeLicenseType,
                    licenseID:employeeLicense,
                    licensePhoto:employeeLicensePhoto?employeeName+"DriverLicense"+employeeLicensePhoto["name"].substring(employeeLicensePhoto["name"].lastIndexOf(".")):null,
                    licenseExpiryDate:employeeLicenseExpiry.toString()
                },
                activity:{
                    companyId:token._id,
                    name:token.name
                }
            }})
            await router.replace("/employees")
            }
            catch(e){
                console.log(JSON.stringify(e))
                toast.error("The Phone Number entered is already registered")
            }
        }
    }

    const handleOtherLanguageChange = (e)=>{
        setOtherLanguage(e.target.value.split(","))
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
                setEmployeeLicenseError(true)
                returnedValue = false
            }
            if(employeeLicenseExpiry===""||employeeLicenseError){
                setEmployeeLicenseExpiryError(true)
                returnedValue = false
            }
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
            if(employeeLicensePhoto===null||employeeLicensePhotoError){
                setEmployeeLicensePhotoError(true)
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

    const handlePhoneChange1 = (e)=>{
            setEmployeePhone1(e.target.value)
            if(validatePhone(e.target.value)){
                setEmployeePhoneError1(false)
            }
            else{
                setEmployeePhoneError1(true)
            }
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

    const handlePhoneChange2 = (e)=>{
        setEmployeePhone2(e.target.value)
        if(validatePhone(e.target.value)){
            setEmployeePhoneError2(false)
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
            setEmergencynameError(true)
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
    <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        /> 
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:"1rem",background:"#F5F5F5",height:"100vh",mb:"1rem",pl:{md:5,xs:3}}}>
        <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Staff")}</Typography>
        <Typography sx={{fontWeight:"700",color:"#CCCCCC",fontSize:"20px",mt:"1rem"}}>{translateWord(locale,"Create New Employee Account")}</Typography>
        <Grid container spacing={2} mt={0.5}>
            <Grid item md={12}>
                <CustomTextField value={employeeName} setValue={handleEmployeeNameChange} error={employeeNameError} placeholder={translateWord(locale,"Name")}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Choose Role")}</Typography>
                <SelectComponent label={"Role"} value={employeeRole} setValue={setEmployeeRole} error={employeeRoleError} setError={setEmployeeRoleError} options={token.role==="BUS COMPANY"?ROLES:ROLES.filter(rl=>rl!=="TRIP MANAGER")}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="TRIP MANAGER"?"block":"none"}}>
                <CustomTextField value={password} setValue={handlePasswordChange} error={passwordError} placeholder={translateWord(locale,"Password")} type={"Password"}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={employeePhone1} setValue={handlePhoneChange1} error={employeePhoneError1} placeholder={translateWord(locale,"Phone Number") + " 1"}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={employeePhone2} setValue={handlePhoneChange2} error={employeePhoneError2} placeholder={translateWord(locale,"Phone Number")+" 2"}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"License Type")}</Typography>
                <SelectComponent label={"License Type"} value={employeeLicenseType} setValue={setEmployeeLicenseType} error={employeeLicenseTypeError} setError={setEmployeeLicenseTypeError} options={LICENSETYPES}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <CustomTextField value={employeeLicense} setValue={handleEmployeeLicenseChange} error={employeeLicenseError} placeholder={translateWord(locale,"License ID")}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"License Expiry Date")}</Typography>
                <DatePicker value={employeeLicenseExpiry} setDateValue={setEmployeeLicenseExpiry} error={employeeLicenseExpiryError} setError={setEmployeeLicenseExpiryError}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole==="DRIVER"?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"License Photo")}</Typography>
                <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"522px",height:"70px",background: "rgba(240, 240, 240, 1)",boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",px:"12px",border:employeeLicensePhotoError?"solid 1px #D32F2F":"solid 1px rgba(240, 240, 240, 1)",borderRadius:"5px",my:"1rem"}}>
                    <Typography sx={{fontFamily:"Open Sans",color: "rgba(204, 204, 204, 1)"}}>{employeeLicensePhoto===null?translateWord(locale,"Enter License Image"):employeeLicensePhoto["name"]}</Typography>
                    <Button variant="outlined" component={"label"} id="licenseImage">{translateWord(locale,"Upload")} <input type={"file"} hidden onChange={(e)=>handleUploadFile(e,"DriverLicense")} name="LogoFile" accept="image/*"/></Button>
                </Box>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={employeeAddress} setValue={handleAddressChange} error={employeeAddressError} placeholder={translateWord(locale,"Address")}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole!=="TRIP MANAGER"?"block":"none"}}>
                <CustomTextField value={emergencyName} setValue={handleEmergencyName} error={emergencyNameError} placeholder={translateWord(locale,"Emergency Responder Name")}/>
            </Grid>
            <Grid item md={12} sx={{display:employeeRole!=="TRIP MANAGER"?"block":"none"}}>
                <CustomTextField value={emergencyPhone} setValue={handleEmergencyPhone} error={emergencyPhoneError} placeholder={translateWord(locale,"Emergency Responder Phone")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={guarantorName} setValue={handleGuarantorNameChange} error={guarantorNameError} placeholder={translateWord(locale,"Guarantor Name")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={guarantorPhone} setValue={handleGuarantorPhoneChange} error={guarantorPhoneError} placeholder={translateWord(locale,"Guarantor Phone")}/>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Languages")}</Typography>
                <CustomMultiSelect selectedFeatures={selectedLanguages} setFeatures={setSelectedLanguage} features={LANGUAGES} error={selectedLanguageError} setError={setSelectedLanguageError}/>
            </Grid>
            <Grid item md={12} sx={{display:selectedLanguages.includes("Other")?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Add Other Languages, Separate them by Comma")}</Typography>
                <CustomTextField value={otherLanguage.join(",")} setValue={handleOtherLanguageChange} placeholder={translateWord(locale,"Add Other Languages")}/>
            </Grid>
            <Grid item sx={{mb:"1rem"}}>
                <Button variant="contained" onClick={addEmployeeButtonClicked} sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}}>{translateWord(locale,"Save")}</Button>
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
    if(tokenDecoded.role!=="BUS COMPANY"&&tokenDecoded.role!=="TRIP MANAGER"){
        return {
            redirect:{
                destination:"/",
                permanent:false
            }
        };
    }
    return {
        props:{locale:nextLocale||locale,
            token:tokenDecoded,
            tokenRaw:token
        }
    }
}

export default Employees