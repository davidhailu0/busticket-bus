import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const CustomTimePicker = ({value,setValue})=>{
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    return (<LocalizationProvider dateAdapter={AdapterMoment}>
        <TimePicker
            label="Departure Time"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} sx={{width:"522px",boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",my:1.5}}/>}
            />
        </LocalizationProvider>
    )
}
export default CustomTimePicker;