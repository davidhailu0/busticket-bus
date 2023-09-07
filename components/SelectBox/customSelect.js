import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Box,FormControl,Tooltip} from '@mui/material'
import { useLocale } from "../../utils/LanguageContext"; 
import { translateWord } from '../../utils/languageTranslation';

export default function SelectComponent({label,value,setValue,error,setError,options,disabled}){
  const {locale} = useLocale()
    const changeValue = (val)=>{
        setValue(val.target.value)
        if(setError){
          setError(false)
        }
    }
    return(<Box sx={{display:"inline-block",width:{md:"522px",xs:"100%"},mr:"2.5rem",my:1.5,borderColor:"white"}}>
            <FormControl fullWidth>
            <Tooltip title={error?"Please Enter a valid "+label:""}>
            <Select
            id={`${label}_id`}
            name={label}
            value={value}
            placeholder={label}
            onChange={changeValue}
            error={error}
            disabled={disabled}
            sx={{
                boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                width:{md:"522px",xs:"320px"},
                color: "grey",
                background:"white"
              }}
            >
            {//eslint-disable-next-line
            options.map((val)=>(<MenuItem key={val} value={val}>
                      {translateWord(locale,val.split(" ").map((str)=>str.substring(0,1).toUpperCase()+str.substring(1).toLowerCase()).join(" "))}
                </MenuItem>))}
            </Select>
            </Tooltip>
            </FormControl>
        </Box>);
}
