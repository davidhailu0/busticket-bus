import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Box,Tooltip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {translateWord} from '../../utils/languageTranslation';
import { useLocale } from '../../utils/LanguageContext';

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#777",
        },
    }
}) 

export default function DepartureDatePicker({value,setDateValue,error,setError,label,disabled}){
  const {locale} = useLocale()
  const todayDate = new Date()
    return (<LocalizationProvider dateAdapter={AdapterMoment}>
        <Tooltip title={error?translateWord(locale,"Please Enter Departure Date"):""}>
        <Box sx={{display:{md:"flex",xs:'none'},width:"522px",my:"0.5rem"}}>
        <ThemeProvider theme={customTheme}>
        <DesktopDatePicker
            inputFormat="DD-MM-YYYY"
            value={value}
            disabled={disabled}
            disablePast
            minDate={todayDate}
            InputProps={{sx:{borderRadius:"5px",width:"522px",boxShadow: "0px 0px 10px 0px #00000026"},name:"date"}}
            onChange={(value)=>{
              const date = new Date(value)
              const dateToday = new Date(new Date().toDateString())
              if(date.getTime()>dateToday.getTime()){
                setError(false)
                setDateValue(date.getTime())
              }
              else{
                setError(true)
              }
            }}
            renderInput={(params) =>{
            return (<TextField {...params} required error={error} sx={{width:"522px",p:"0",background:"white"}}/>)}}
          />
          </ThemeProvider>
        </Box>
        </Tooltip>
        <Box sx={{display:{md:"none",xs:'flex'},width:"80vw"}}>
        <ThemeProvider theme={customTheme}>
          <MobileDatePicker
            label={translateWord(locale,label)}
            inputFormat="DD/MM/YYYY"
            value={value}
            disablePast
            onChange={setDateValue}
            renderInput={(params) => <TextField {...params} fullWidth sx={{margin:"2rem 0.5rem",color:"white"}}/>}
          />
          </ThemeProvider>
        </Box>
      </LocalizationProvider>);
}