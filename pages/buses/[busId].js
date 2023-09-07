import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import { gql,useMutation } from "@apollo/client"
import { useRouter } from "next/router"
import SideBar from "../../components/sidebar"
import ManagementAppbar from "../../components/ManagementAppbar"
import CustomTextField from "../../components/CustomTextField"
import CustomMultiSelect from "../../components/multiSelect/customMultiSelect"
import SeatPicker from "../../components/seatPicker"
import { LocaleLanguage } from "../../utils/LanguageContext";
import client from "../../utils/ApolloServer"
import { validateNumber } from "../../utils/validate"
import { UnavailableContext } from "../../utils/UnavailableSeatContext"
import { translateWord } from "../../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const MUTATIONUPDATEBUS = gql`
mutation updateBus($busID:ID!,$BusInfo:updateBusInput!,$activity:CreateActivityLog){
    updateBus(busID:$busID,BusInfo:$BusInfo,activity:$activity){
                plateNumber
                busBrand
                busModel
                manufacturedYear
                VIN
                driver{
                    name
                }
                features
                numberOfSeats
    }
}`

const EditBus= ({locale,bus,busId,token})=>{
    const [plateNumber] = useState(bus["plateNumber"])
    const [busBrand] = useState(bus["busBrand"])
    const [busModel] = useState(bus["busModel"])
    const [manufacturedDate] = useState(bus["manufacturedYear"])
    const [VIN] = useState(bus["VIN"])
    const [seatNumber,setSeatNumber] = useState(bus["numberOfSeats"])
    const [seatNumberError,setSeatNumberError] = useState(false)
    const [numberOfUnavailbleSeats,setNumberOfUnavailableSeats] = useState([...bus["unavailableSeats"]])
    const [numberOfUnavailbleSeatsError,setNumberOfUnavailableSeatsError] = useState(false)
    const [selectedFeatures,setSelectedFeatures] = useState([...bus["features"]])
    const [selectedFeaturesError,setSelectedFeaturesError] = useState(false)
    const [drawerState,setDrawerState] = useState(false)
    const [disabled,setDisabled] = useState(true)
    const [updateBus] = useMutation(MUTATIONUPDATEBUS)
    const [seatPicker,setSeatPicker] = useState(false)
    const router = useRouter()

    const handleSeatNumberChange = (e)=>{
        setSeatNumber(e.target.value)
        if(validateNumber(e.target.value)){
            setSeatNumberError(false)
        }
        else{
            setSeatNumberError(true)
        }
    }

    const onButtonClicked = async()=>{
        if(disabled){
            setDisabled(false)
        }
        else{
            if(!numberOfUnavailbleSeatsError){
                await updateBus({variables:{
                    busID:busId,
                    BusInfo:{
                        features:selectedFeatures,
                        numberOfSeats:parseInt(seatNumber),
                        unavailableSeats:numberOfUnavailbleSeats
                    },
                    activity:{
                        companyId:token._id,
                        name:token.accountName
                    }
                }})
                router.reload()
            }
        }
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:{md:"2rem",xs:0},background:"#F5F5F5",height:"100vh",mb:"1rem"}}>
        <Typography variant="h4" sx={{ml:5,fontWeight:"700"}}>Edit Bus</Typography>
        <Grid container spacing={2} pl={5} mt={0.5}>
        <Grid item md={12} sx={{display:disabled?"block":"none"}}>
                <CustomTextField placeholder={translateWord(locale,"Plate Number")} value={plateNumber} disabled={disabled}/>
            </Grid>
            <Grid item md={12} sx={{display:disabled?"block":"none"}}>
                <CustomTextField placeholder={translateWord(locale,"Brand")} value={busBrand} disabled={disabled}/>
            </Grid>
            <Grid item md={12} sx={{display:disabled?"block":"none"}}>
                <CustomTextField placeholder={translateWord(locale,"Model")} value={busModel} disabled={disabled}/>
            </Grid>
            <Grid item md={12} sx={{display:disabled?"block":"none"}}>
                <CustomTextField placeholder={translateWord(locale,"Manufactured Year")} value={manufacturedDate}  disabled={disabled}/>
            </Grid>
            <Grid item md={12} sx={{display:disabled?"block":"none"}}>
                <CustomTextField placeholder={translateWord(locale,"VIN")} value={VIN} disabled={disabled}/>
            </Grid>
            <Grid item md={12}>
                <CustomTextField value={seatNumber} setValue={handleSeatNumberChange} error={seatNumberError} placeholder={"Enter Seat Number"} type={"number"} disabled={disabled}/>
            </Grid>
            <Grid item md={12} sx={{display:parseInt(seatNumber)<49?"block":"none",}}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>Select Unavailable Seats</Typography>
                <Box sx={{border:numberOfUnavailbleSeatsError&&!disabled?"1px solid #ff0000":"none",width:"522px"}}>
                    <Button variant="outlined" onClick={()=>setSeatPicker(true)} disabled={disabled}>Select Seats</Button>
                </Box>
                <UnavailableContext.Provider value={{numberOfUnavailbleSeats,setNumberOfUnavailableSeats,unavailableSeats:49-parseInt(seatNumber),setNumberOfUnavailableSeatsError}}>
                    <SeatPicker value={seatPicker} setValue={setSeatPicker} />
                </UnavailableContext.Provider>
            </Grid>
            <Grid item md={12}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Features")}</Typography>
                <CustomMultiSelect selectedFeatures={selectedFeatures} setFeatures={setSelectedFeatures} features={["WI-FI","USB Charger"]} disabled={disabled} error={selectedFeaturesError} setError={setSelectedFeaturesError}/>
            </Grid>
            <Grid item md={12} sx={{mb:"2rem"}}>
                <Button onClick={onButtonClicked} variant="contained" sx={{height:"60px",width:"197px",fontSize:"20px",textTransform:"none"}}>{disabled?"Edit":"Save"}</Button>
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
    const {busId} =  params
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
        query bus($busId:ID!){
            bus(busId:$busId){
                plateNumber
                busBrand
                busModel
                manufacturedYear
                VIN
                driver{
                    _id
                    name
                }
                features
                numberOfSeats
                unavailableSeats
            }
        }`,variables:{
            busId:busId
        }
    })
    return {
        props:{locale:nextLocale||locale,
            bus:data["data"]["bus"],
            busId,
            token:tokenDecoded
        }
    }
}

export default EditBus