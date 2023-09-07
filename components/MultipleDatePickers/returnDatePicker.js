import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {StaticDatePicker} from "@mui/x-date-pickers/StaticDatePicker";
import {PickersDay} from "@mui/x-date-pickers/PickersDay";
import { useGroupedContext } from "../../utils/GroupDataContext";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "selected"
})(({ theme, selected }) => ({
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark
    },
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%"
  })
}));

export default function MultiDatePicker({duration,values,setValues,grouped,ind,error,setError}) {
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate()+1)
  const [openError,setOpenError] = useState(false)
  const {selectedBuses,busesInfo,setBusDate,departureDates} = useGroupedContext()

  const findDate = (date) => {
    const dateTime = new Date(new Date(date).toLocaleDateString()+" UTC").getTime().toString();
    return values.find((item) => item=== dateTime);
  };

  const findIndexDate = (dates, date) => {
    const dateTime = date.getTime().toString();
    return dates.findIndex((item) => item === dateTime);
  };

  const renderPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!values) {
      return <PickersDay {...pickersDayProps} />;
    }
    const selected = findDate(date._d);
    const dateTime = new Date(new Date(date._d).toLocaleDateString()+" UTC")
    const bs = busesInfo.find(({_id})=>_id===selectedBuses[parseInt(ind)])
    let disabled = false;
    const dateNow = new Date(new Date(Date.now()).toLocaleDateString()+" UTC")
    dateNow.setDate(dateNow.getDate()+14)
    const yesterDayDate = new Date(dateTime.getTime())
    yesterDayDate.setDate(yesterDayDate.getDate()-1)
    const tomorrowDate = new Date(dateTime.getTime())
    tomorrowDate.setDate(tomorrowDate.getDate()+1)
    if((bs&&bs["assignedDates"].includes(dateTime.getTime().toString())&&!values.find(dt=>new Date(parseInt(dt)).getTime()==dateTime.getTime()))||(duration>6&&bs&&bs["assignedDates"].includes(yesterDayDate.getTime().toString())&&!values.find(dt=>new Date(parseInt(dt)).getTime()==yesterDayDate.getTime())&&!departureDates[parseInt(ind)].includes(yesterDayDate.getTime().toString()))||
    (duration>6&&values.includes(yesterDayDate.getTime().toString()))){
      disabled = true
    }
    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        selected={selected}
        id={"b"+dateTime.getTime().toString().substring(2,dateTime.getTime().toString().length-5)}
        disabled={pickersDayProps.disabled||disabled||dateNow.getTime()<=dateTime.getTime()}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
    <Box sx={{display:"flex",justifyContent:"flex-start",my:"1rem",border:error?"1px solid #D32F2F":"none",width:"325px"}}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        label="Week picker"
        value={values}
        disablePast
        disableHighlightToday={true}
        minDate={tomorrowDate}
        onChange={(newValue) => {
          if(!selectedBuses[parseInt(ind)]){
            setError(prev=>{
              let newPrev = [...prev]
              newPrev[ind] = true
              return newPrev
            })
            setOpenError(true)
            return
          }
          const array = [...values];
          let date = new Date(newValue._d.toDateString());
          date = new Date(`${date.toLocaleDateString()} UTC`)
          const index = findIndexDate(array, date);
          if (index >= 0) {
            array.splice(index, 1);
            if(grouped){
              setValues(prev=>{
                let newPrev = [...prev]
                newPrev[ind] = array
                return newPrev
              })
              setBusDate(prev=>{
                let newPrev = prev.map((obj)=>{
                  if(obj._id===selectedBuses[parseInt(ind)]){
                    if(duration>6){
                      const sortedDates = obj.assignedDates.sort((a,b)=>parseInt(a)-parseInt(b))
                      let indexOfRemoved = sortedDates.indexOf(date.getTime().toString())
                      sortedDates.splice(indexOfRemoved,1)
                      indexOfRemoved = sortedDates.indexOf(date.getTime().toString())
                      if(indexOfRemoved>=0){
                        sortedDates.splice(indexOfRemoved,1)
                      }
                      return {...obj,assignedDates:sortedDates}
                    }
                    const newAssignedDates = obj.assignedDates.filter(dt=>dt!==date.getTime().toString())
                    return {...obj,assignedDates:newAssignedDates}
                  }
                  return obj
                })
                return newPrev
              })
            }
            else{
              setValues(array);
            }
          }
          else {
            array.push(date.getTime().toString());
            if(grouped){
              setValues(prev=>{
                let newPrev = [...prev]
                newPrev[ind] = array
                return newPrev
              })
              setBusDate(prev=>{
                let newPrev = prev.map((obj)=>{
                  if(obj._id===selectedBuses[parseInt(ind)]){
                    let tempContainer = obj.assignedDates.filter(dt=>array.find(tmpDt=>new Date(parseInt(tmpDt)).getTime()!==new Date(parseInt(dt)).getTime()))
                      return {...obj,assignedDates:[...tempContainer,...array]}
                  }
                  return obj
                })
                return newPrev
              })
              setError(prev=>{
                let newPrev = [...prev]
                newPrev[ind] = false
                return newPrev
              })
            }
            else{
              setValues(array);
            }
          }
        }}
        renderDay={renderPickerDay}
        renderInput={(params) => <TextField {...params}/>}
        inputFormat="'Week of' MMM d"
      />
      </Box>
    </LocalizationProvider>
  ); 
}