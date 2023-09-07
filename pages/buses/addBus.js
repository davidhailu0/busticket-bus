import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import { useMutation,gql } from "@apollo/client"
import { ToastContainer,toast } from "react-toastify"
import { useRouter } from "next/router"
import SideBar from "../../components/sidebar"
import ManagementAppbar from "../../components/ManagementAppbar"
import CustomTextField from "../../components/CustomTextField"
import { LocaleLanguage } from "../../utils/LanguageContext";
import {validatePlateNumber,validateName,validateVIN,validateYear,validateNumber} from "../../utils/validate"
import CustomMultiSelect from "../../components/multiSelect/customMultiSelect"
import SeatPicker from "../../components/seatPicker"
import client from "../../utils/ApolloServer"
import { UnavailableContext } from "../../utils/UnavailableSeatContext"
import { translateWord } from "../../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const MUTATEADDBUS = gql`
 mutation addBus($newBusInput:createBusInput!,$activity:CreateActivityLog){
    addBus(newBusInput:$newBusInput,activity:$activity){
        plateNumber
    }
 }`

const FEATURES = ["WI-FI","USB Charger"]

const AddBus= ({locale,token})=>{
    const [plateNumber,setPlateNumber] = useState("")
    const [plateNumberError,setPlateNumberError] = useState(false)
    const [busBrand,setBusBrand] = useState("")
    const [busBrandError,setBusBrandError] = useState(false)
    const [busModel,setBusModel] = useState("")
    const [busModelError,setBusModelError] = useState(false)
    const [manufacturedDate,setManufacturedDate] = useState("")
    const [manufacturedDateError,setManufacturedDateError] = useState(false)
    const [VIN,setVIN] = useState("")
    const [VINError,setVINError] = useState(false)
    const [seatNumber,setSeatNumber] = useState("49")
    const [seatNumberError,setSeatNumberError] = useState(false)
    const [numberOfUnavailbleSeats,setNumberOfUnavailableSeats] = useState([])
    const [numberOfUnavailbleSeatsError,setNumberOfUnavailableSeatsError] = useState(false)
    const [selectedFeatures,setSelectedFeatures] = useState([])
    const [drawerState,setDrawerState] = useState(false)
    const [seatPicker,setSeatPicker] = useState(false)
    const [addBus] = useMutation(MUTATEADDBUS)
    const router = useRouter() 

    const handlePlateNumberChange = (e)=>{
        setPlateNumber(e.target.value.trim())
        if(validatePlateNumber(e.target.value)){
            setPlateNumberError(false)
        }
        else{
            setPlateNumberError(true)
        }
    }

    const handleBusBrandChange = (e)=>{
        setBusBrand(e.target.value.trim())
        if(validateName(e.target.value)){
            setBusBrandError(false)
        }
        else{
            setBusBrandError(true)
        }
    }

    const handleBusModelChange = (e)=>{
        setBusModel(e.target.value)
        if(validateName(e.target.value)){
            setBusModelError(false)
        }
        else{
            setBusModelError(true)
        }
    }

    const handleManufacturedDateChange = (e)=>{
        if(parseInt(e.target.value)!==NaN){
            setManufacturedDate(e.target.value.trim())
        }
        if(validateYear(e.target.value.trim())||e.target.value===""){
            setManufacturedDateError(false)
        }
        else{
            setManufacturedDateError(true)
        }
    }

    const handleVINChange = (e)=>{
        setVIN(e.target.value)
        if(validateVIN(e.target.value)){
            setVINError(false)
        }
        else{
            setVINError(true)
        }
    }

    const handleSeatNumberChange = (e)=>{
        setSeatNumber(e.target.value)
        if(validateNumber(e.target.value)&&parseInt(e.target.value)<=49&&parseInt(e.target.value)>=1){
            setSeatNumberError(false)
        }
        else{
            setSeatNumberError(true)
        }
    }

    const handleAddBusClick = async()=>{
        if(validateInputs()){
            try{
                    const newBus = await addBus({variables:{newBusInput:{
                    busOwner:token._id,
                    busBrand:busBrand,
                    busModel:busModel,
                    manufacturedYear:parseInt(manufacturedDate),
                    plateNumber:plateNumber,
                    features:selectedFeatures,
                    numberOfSeats:parseInt(seatNumber),
                    unavailableSeats:numberOfUnavailbleSeats,
                    VIN:VIN
                    },
                    activity:{
                        companyId:token._id,
                        name:token.accountName
                    }
            }})
                await router.replace("/buses")
            }
            catch(e){
                toast.error(e.message)
            }
        }
    }

    const validateInputs = ()=>{
        let returnedValue = true
        if(plateNumber===""||plateNumberError){
            setPlateNumberError(true)
        }
        if(busBrand===""||busBrandError){
            setBusBrandError(true)
            returnedValue = false
        }
        if(busModel===""||busModelError){
            setBusModelError(true)
            returnedValue = false
        }
        if(manufacturedDate===""||manufacturedDateError){
            setManufacturedDateError(true)
            returnedValue = false
        }
        if(VIN===""||VINError){
            setVINError(true)
        }
        if(seatNumber===""||seatNumberError){
            setSeatNumberError(true)
            returnedValue = false
        }
        if(seatNumber<49&&numberOfUnavailbleSeats.length!==49-parseInt(seatNumber)){
            setNumberOfUnavailableSeatsError(true)
            returnedValue = false
        }
        return returnedValue
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
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:{md:"2rem",xs:0},background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
        <Typography variant="h4" sx={{ml:5,fontWeight:"700"}}>{translateWord(locale,"Bus")}</Typography>
        <Typography sx={{ml:5,fontWeight:"700",color:"#CCCCCC",mt:"0.3rem"}}>{translateWord(locale,"Add New Bus")}</Typography>
        <Grid container spacing={2} pl={5} mt={0.5}>
            <Grid item md={12}>
                <CustomTextField value={plateNumber} setValue={handlePlateNumberChange} error={plateNumberError} placeholder={translateWord(locale,"Plate Number")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={busBrand} setValue={handleBusBrandChange} error={busBrandError} placeholder={translateWord(locale,"Brand")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={busModel} setValue={handleBusModelChange} error={busModelError} placeholder={translateWord(locale,"Model")} />
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={manufacturedDate} setValue={handleManufacturedDateChange} error={manufacturedDateError} placeholder={translateWord(locale,"Manufactured Year")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={VIN} setValue={handleVINChange} error={VINError} placeholder={translateWord(locale,"VIN")}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={seatNumber} setValue={handleSeatNumberChange} error={seatNumberError} placeholder={translateWord(locale,"Number of Seats")} type={"number"} max={49}/>
            </Grid>
            <Grid item md={12} sx={{display:parseInt(seatNumber)<49?"block":"none"}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Select Unavailable Seats</Typography>
                <Box sx={{border:numberOfUnavailbleSeatsError?"1px solid #ff0000":"none",width:"522px"}}>
                    <Button variant="outlined" onClick={()=>setSeatPicker(true)}>Select Seats</Button>
                </Box>
                <UnavailableContext.Provider value={{numberOfUnavailbleSeats,setNumberOfUnavailableSeats,unavailableSeats:49-parseInt(seatNumber),setNumberOfUnavailableSeatsError}}>
                    <SeatPicker value={seatPicker} setValue={setSeatPicker} />
                </UnavailableContext.Provider>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Features")}</Typography>
                <CustomMultiSelect label={"Features"} selectedFeatures={selectedFeatures} setFeatures={setSelectedFeatures} features={FEATURES}/>
            </Grid>
            <Grid item sx={{mb:"2rem"}}>
                <Button variant="contained" sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}} onClick={handleAddBusClick}>Add</Button>
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
    const routes = await client.query({
        query:gql`
        query allRoutesOfBusCompany($busCompanyId:ID!){
            allRoutesOfBusCompany(busCompanyId:$busCompanyId){
                _id
                departure
                destination
            }
        }`,variables:{
            busCompanyId:tokenDecoded._id
        }
    })
    return {
        props:{locale:nextLocale||locale,
            routes:routes["data"]["allRoutesOfBusCompany"],
            token:tokenDecoded
        }
    }
}

export default AddBus