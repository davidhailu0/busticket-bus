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

export default function MultiDatePicker({values,setValues,grouped,ind,error,duration,setError}) {
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate()+1)
  const [openError,setOpenError] = useState(false)
  const {selectedBuses,busesInfo,setBusDate,departureDates,returnDates,setReturnDates,setDepartureTime,setReturnTime} = useGroupedContext()

  const findDate = (date) => {
    const dateTime = new Date(new Date(date).toLocaleDateString()+" UTC").getTime().toString();
    return values.find((item) => item === dateTime);
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
    const compareDate = new Date(new Date(date._d).toLocaleDateString()+" UTC")
    compareDate.setDate(compareDate.getDate()-1)
    const dateNow = new Date(new Date(Date.now()).toLocaleDateString()+" UTC")
    const tomorrowDate = new Date(dateTime.getTime())
    tomorrowDate.setDate(tomorrowDate.getDate()+1)
    dateNow.setDate(dateNow.getDate()+14)
    let disabled = false
    const bs = busesInfo.find(({_id})=>_id===selectedBuses[parseInt(ind)])
    if((duration>6&&departureDates[parseInt(ind)].includes(compareDate.getTime().toString()))||(duration>6&&bs&&bs["assignedDates"].includes(tomorrowDate.getTime().toString())&&!values.find(dt=>new Date(parseInt(dt)).getTime()==dateTime.getTime())&&!returnDates[parseInt(ind)].includes(tomorrowDate.getTime().toString()))||(tomorrowDate.getTime()>=dateNow.getTime())){
      disabled = true
    }
    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        id={"a"+dateTime.getTime().toString().substring(2,dateTime.getTime().toString().length-5)}
        selected={selected}
        disabled={pickersDayProps.disabled||(bs&&bs["assignedDates"].includes(dateTime.getTime().toString())&&!values.find(dt=>new Date(parseInt(dt)).getTime()==dateTime.getTime()))||disabled||dateTime.getTime()>=dateNow.getTime()}
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
            const tempArray = array.map(dt=>dt)
            array.splice(index, 1);
            if(grouped){
              const sortedArray = tempArray.sort((a,b)=>parseInt(a)-parseInt(b))
              const foundedIndex = sortedArray.findIndex((dt)=>dt===date.getTime().toString())
              setValues(prev=>{
                let newPrev = [...prev]
                newPrev[ind].splice(foundedIndex,1)
                return newPrev
              })
              if(duration>6){
                setReturnDates(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind].splice(foundedIndex,1)
                  return newPrev
                })

                setDepartureTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind].splice(foundedIndex,1)
                  return newPrev;
                })
                setReturnTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind].splice(foundedIndex,1)
                  return newPrev;
                })
              }
              else{
                setReturnDates(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind].splice(foundedIndex,1)
                  return newPrev
                })
                setDepartureTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind].splice(foundedIndex,1)
                  return newPrev;
                })
                setReturnTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind].splice(foundedIndex,1)
                  return newPrev;
                })
              }
              setBusDate(prev=>{
                let newPrev = prev.map((obj)=>{
                  if(obj._id===selectedBuses[parseInt(ind)]){
                    if(duration>6){
                    const sortedDates = obj.assignedDates.sort((a,b)=>parseInt(a)-parseInt(b))
                    const indexOfRemoved = sortedDates.indexOf(date.getTime().toString())
                    sortedDates.splice(indexOfRemoved,2)
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
              if(duration>6){
                setReturnDates(prev=>{
                  let newPrev = [...prev]
                  let filteredArray = array.map(dt=>{
                    const newDate = new Date(parseInt(dt))
                    newDate.setDate(newDate.getDate()+1)
                    return newDate.getTime().toString()
                  })
                  newPrev[ind] = filteredArray
                  return newPrev
                })
                const sortedArray = array.sort((a,b)=>parseInt(a)-parseInt(b))
                const foundedIndex = sortedArray.findIndex((dt)=>dt===date.getTime().toString())
                setDepartureTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind][foundedIndex] = "4:00 AM"
                  return newPrev;
                })
                setReturnTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind][foundedIndex] = "4:00 AM"
                  return newPrev;
                })
              }
              else{
                const sortedArray = array.sort((a,b)=>parseInt(a)-parseInt(b))
                const foundedIndex = sortedArray.findIndex((dt)=>dt===date.getTime().toString())
                setDepartureTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind][foundedIndex] = "4:00 AM"
                  return newPrev;
                })
                setReturnTime(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind][foundedIndex] = "6:00 PM"
                  return newPrev;
                })
                setReturnDates(prev=>{
                  let newPrev = [...prev]
                  newPrev[ind] = array
                  return newPrev
                })
              }
              setBusDate(prev=>{
                let newPrev = prev.map((obj)=>{
                  if(obj._id===selectedBuses[parseInt(ind)]){
                    let tempContainer = obj.assignedDates.filter(dt=>array.find(tmpDt=>new Date(parseInt(tmpDt)).getTime()!==new Date(parseInt(dt)).getTime()))  
                    if(duration>6){
                      const tomorrowDate = new Date(date.getTime())
                      tomorrowDate.setDate(tomorrowDate.getDate()+1)
                      return {...obj,assignedDates:[...array,tomorrowDate.getTime().toString()]}
                    }
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