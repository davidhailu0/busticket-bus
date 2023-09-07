import {Grid,Typography,Button,Box} from "@mui/material"
import { ToastContainer,toast } from "react-toastify"
import DefaultSelectComponent from "../SelectBox/defaultSelectBox"
import SelectComponentBus from "../SelectBox/customeDriverToBusSelect"
import MultiDatePicker from "../MultipleDatePickers"
import MultiDatePickerReturn from "../MultipleDatePickers/returnDatePicker"
import { useGroupedContext } from "../../utils/GroupDataContext"
import { useLocale } from "../../utils/LanguageContext"
import { translateWord } from "../../utils/languageTranslation"

const DEPARTURETIME = ["4:00 AM","6:00 PM"]
const GroupedSchedule = ({duration,ind})=>{
    const {locale} = useLocale()
    const {
        availableBuses,
        selectedBuses,
        busErrors,
        departureDates,
        setDepartureDates,
        departureDateError,
        setDepartureDateError,
        setBusErrors,
        setSelectedBuses,
        returnDates,
        setReturnDates,
        departureTime,
        setDepartureTime,
        returnTime,setReturnTime,
        setGroupedSchedule} = useGroupedContext()

    const removeBTNClick = ()=>{
        setGroupedSchedule(prev=>{
            let newArray = prev.filter(val=>val!==ind)
            newArray = newArray.map(val=>{
                if(parseInt(val)<parseInt(ind)){
                    return `${val}`
                }
                return `${parseInt(val)-1}`
            })
            return newArray
        })
        setSelectedBuses(prev=>{
            let newPrev = [...prev]
            newPrev.splice(ind,1)
            return newPrev
        })
        setDepartureDates(prev=>{
            let newPrev = [...prev]
            newPrev.splice(ind,1)
            return newPrev
        })
        if(duration<6){
            setDepartureTime(prev=>{
                let newPrev = [...prev]
                newPrev.splice(ind,1)
                return newPrev
            })
        }
    }

    const changeValueDepartureTime = (val,index)=>{
        if(departureDates[ind][index]!==returnDates[ind][index]){
            setDepartureTime(prev=>{
                let newArr = [...prev]
                newArr[parseInt(ind)][index] = val
                return newArr
            })
        }
        else{
            toast.error("You Can't change the time on the same day")
        }
    } 

    const changeValueReturnTime = (val,index)=>{
        if(departureDates[ind][index]!==returnDates[ind][index]){
            setReturnTime(prev=>{
                let newArr = [...prev]
                newArr[parseInt(ind)][index] = val
                return newArr
            })
        }
        else{
            toast.error("You Can't change the time on the same day")
        }
    } 

    return (<>
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
            <Grid item md={12}>
                <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"522px"}}>
                    <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Bus")}</Typography>
                    <Button sx={{textTransform:"none",display:ind==='0'?"none":"block"}} onClick={removeBTNClick}>Remove</Button>
                </Box>
                <SelectComponentBus label={"Bus"} value={selectedBuses[parseInt(ind)]} setValue={setSelectedBuses} error={busErrors[parseInt(ind)]} setError={setBusErrors} options={availableBuses[parseInt(ind)]} grouped={true} ind={ind}/>
            </Grid>
            <Grid item md={6}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Departure Date")}</Typography>
                <MultiDatePicker values={departureDates[parseInt(ind)]} setValues={setDepartureDates} grouped={true} ind={ind} error={departureDateError[parseInt(ind)]} setError={setDepartureDateError} duration={duration}/>
            </Grid>
            <Grid item md={6}>
                <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Return Date")}</Typography>
                <MultiDatePickerReturn values={returnDates[parseInt(ind)]} setValues={setReturnDates} grouped={true} ind={ind} error={departureDateError[parseInt(ind)]} setError={setDepartureDateError} duration={duration}/>
            </Grid>
            {duration<=6&&departureDates[parseInt(ind)].map((dt,index)=>{
                return (<>
                <Grid item md={6}>
                    <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Departure Time")}</Typography>
                    <DefaultSelectComponent label={"Departure Time"} value={departureTime[parseInt(ind)][index]} setValue={changeValueDepartureTime} options={DEPARTURETIME} ind={index}/>
                </Grid>
                <Grid item md={6}>
                    <Typography sx={{color:"#CCCCCC"}} fontWeight={600}>{translateWord(locale,"Return Time")}</Typography>
                    <DefaultSelectComponent label={"Return Time"} value={returnTime[parseInt(ind)][index]} setValue={changeValueReturnTime} options={DEPARTURETIME} ind={index}/>
                </Grid>
                </>
                )
            })}
            </>)
}

export default GroupedSchedule;
