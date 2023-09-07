import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Box,FormControl,Tooltip} from '@mui/material'
import { useLocale } from "../../utils/LanguageContext"; 
import { translateWord } from '../../utils/languageTranslation';

export default function DefaultSelectComponent({label,value,setValue,error,setError,options,disabled,ind}){
  const {locale} = useLocale()
    const changeValue = (val)=>{
        if(setError){
          setError(false)
        }
        if(ind===0||ind>0){
          setValue(val.target.value,ind)
          return
        }
        setValue(val.target.value)
    }
    return(<Box sx={{display:"flex",justifyContent:"end",width:{md:"200px",xs:"100%"},mr:"2.5rem",my:1.5,borderColor:"white",borderRadius:"10px"}}>
            <FormControl sx={{display:"flex",justifyContent:"end"}}>
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
                width:"200px",
                color: "grey",
                background:"white",
                borderRadius:"10px",
              }}
            >
            {//eslint-disable-next-line
            options.map((val)=>(<MenuItem key={val} value={val}>
                      {translateWord(locale,val)}
                </MenuItem>))}
            </Select>
            </Tooltip>
            </FormControl>
        </Box>);
}