import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CustomMultiSelectDate({selectedDates,setDates,setReturnDates,dates,disabled,error,setError,differentFrom,setReturnDateError}) {
  
  console.log(selectedDates)
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDates(
      typeof value === 'string' ? value.split(',') : value,
    );
    if(setReturnDates){
      setReturnDateError(false)
      setReturnDates(prev=>{
        const returnDays = value.map((dy)=>{
        let dayAfter;
        if(dates.indexOf(dy)+1==dates.length){
            dayAfter = dates[0]
        }
        else{
            dayAfter = dates[dates.indexOf(dy)+1]
        }
        return dayAfter;
        })
        return returnDays
      })
    }
    setError(false)
  };

  return (<Select
          multiple
          value={selectedDates}
          onChange={handleChange}
          renderValue={(selected) => {
            return selected.join(', ')}}
          MenuProps={MenuProps}
          disabled={disabled}
          error={error}
          sx={{width:"522px",boxShadow: "0px 0px 10px 0px #00000026",mt:"0.5rem",background:"#fff"}}
        >
          {dates.map((dte,ind) => (
            <MenuItem key={dte} value={dte} disabled={selectedDates.includes(dates[dates.indexOf(dte)-1])||(selectedDates.includes("MONDAY")&&ind==6)||(selectedDates.includes("SUNDAY")&&ind==0)||(selectedDates.length===3&&!selectedDates.includes(dte))||(differentFrom&&differentFrom.includes(dte))}>
                <Checkbox checked={selectedDates.indexOf(dte) > -1} />
                <ListItemText primary={dte} />
            </MenuItem>
          ))}
        </Select>
  );
}