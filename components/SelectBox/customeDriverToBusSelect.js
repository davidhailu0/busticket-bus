import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useRouter } from 'next/router';
import {Box,FormControl,Tooltip} from '@mui/material'
import { ToastContainer,toast } from 'react-toastify';
import { useLocale } from "../../utils/LanguageContext"; 
import { useGroupedContext } from '../../utils/GroupDataContext';
import { gql,useMutation } from "@apollo/client";

const MUTATIONREASSIGNSCHEDULE = gql`
mutation reassignScheduledTrip($id:ID!,$reassignedSchedule:reassignedScheduleInput!,$activity:CreateActivityLog){
    reassignScheduledTrip(id:$id,reassignedSchedule:$reassignedSchedule,activity:$activity){
                duration
    }
}`

export default function SelectComponent({label,value,setValue,error,setError,options,disabled,grouped,ind}){
  const {locale,token} = useLocale()
  const groupedContext = useGroupedContext()
  const {scheduleID} = useRouter().query
  const [reassignTrip] = useMutation(MUTATIONREASSIGNSCHEDULE)

  const changeValue = async(val)=>{
        if(grouped){
          const changedBusObj = groupedContext.busesInfo.find(({_id})=>_id===val.target.value)
          if(changedBusObj["assignedDates"].find(dt=>groupedContext.departureDates[parseInt(ind)].includes(dt))){
            toast.error("The Selected Bus is assigned on the same date to other destionation")
            return 
          }
          groupedContext.setAvailableBuses(prev=>{
            let newPrev = []
            let count=0;
            for(let el of prev){
              if(count!==parseInt(ind)){
                newPrev.push(el.filter(obj=>obj["_id"]!==val.target.value))
              }
              else{
                newPrev.push(el)
              }
              count++;
            }
            return newPrev
          })
          await reassignTrip({variables:{
            id:scheduleID,
            reassignedSchedule:{
              previousBusID:value,
              newBusID:val.target.value
            },
            activity:{
              companyId:token._id,
              name:token.accountName,
            }
          }})
          setValue(prev=>{
            let newPrev = [...prev]
            newPrev[ind] = val.target.value
            return newPrev
          })
          if(setError.length>0){
              setError(prev=>{
                let newPrev = [...prev]
                newPrev[ind] = false
                return newPrev
              })
          }
        }
        else{
          setValue(val.target.value)
          if(setError){
            setError(false)
          }
        }
    }
    return(<Box sx={{display:"inline-block",width:{md:"522px",xs:"320px"},mr:"2.5rem",my:1.5,borderColor:"white"}}>
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
            <FormControl>
            <Tooltip title={error?"Please Enter a valid "+label:""}>
            <Select
            id={label}
            name={label}
            value={value}
            placeholder={label}
            onChange={changeValue}
            error={error}
            disabled={disabled}
            sx={{
                boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                width:{md:"522px",xs:"300px"},
                color: "grey",
                background:"white"
              }}
            renderValue={(value)=>{
                const {plateNumber,driver:{name}}= options.find(({_id})=>_id===value)
                return name+" - "+plateNumber
            }}
            >
            {//eslint-disable-next-line
            options.map(({_id,plateNumber,driver:{name}})=>(<MenuItem key={_id} value={_id}>
                      {name+" - "+plateNumber}
                </MenuItem>))}
            </Select>
            </Tooltip>
            </FormControl>
        </Box>);
}