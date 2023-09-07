import { TextField,Tooltip } from "@mui/material";
import { translateWord } from "../../utils/languageTranslation";
import { useLocale } from "../../utils/LanguageContext";

export default function CustomTextField({value,setValue,error,type="text",placeholder,disabled,max}){
    const {locale} = useLocale()
    return (
        <Tooltip title={error?"Please Enter a valid "+placeholder:""}>
            <TextField label={placeholder} name={placeholder} value={value} type={type} onChange={setValue} placeholder={translateWord(locale,"Enter ")+placeholder} error={error} sx={{my:"0.5rem",width:{md:"522px",xs:"320px"},boxShadow: "0px 0px 10px 0px #00000026",background:"#fff"}} disabled={disabled} InputProps={{inputProps:{min:1,max:max?max:100,id:placeholder}}}/>
        </Tooltip>
)
}