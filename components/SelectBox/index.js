import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Box,FormControl,Tooltip} from '@mui/material'
import { useLocale } from "../../utils/LanguageContext"; 

export default function SelectComponent({label,value,setValue,error,setError,options,disabled,grouped,ind}){
  const {locale} = useLocale()
    const changeValue = (val)=>{
        if(grouped){
          setValue((prev)=>{
            let newPrev = [...prev]
            newPrev[ind] = val.target.value
            return newPrev
          })
          if(setError){
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
    return(<Box sx={{display:"inline-block",width:{md:"522px",xs:"300px"},mr:"2.5rem",my:1.5,borderColor:"white"}}>
            <FormControl >
            <Tooltip title={error?"Please Enter a valid "+label:""}>
            <Select
            id={label}
            name={label}
            value={value}
            placeholder={label}
            onChange={changeValue}
            error={error}
            disabled={disabled}
            renderValue={(value)=>{
              if(value["name"]){
                return value["name"]
              }
              return value
            }}
            sx={{
                boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                width:{md:"522px",xs:"300px"},
                color: "grey",
                background:"white"
              }}
            >
            {//eslint-disable-next-line
            options.map((val)=>(<MenuItem key={val["_id"]} value={val}>
                      {val["name"]}
                </MenuItem>))}
            </Select>
            </Tooltip>
            </FormControl>
        </Box>);
}
