import {Box,Typography} from "@mui/material"
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const BusBox = ({plateNumber,driverName,onClick})=>{
    const {locale} = useLocale()
    return (<Box onClick={onClick} sx={{width:"230px",height:"150px",background:"#fff",":hover":{cursor:"pointer"},display:"flex",justifyContent:"space-between",flexDirection:"column",py:3,pl:2.5,}}>
        <Typography fontWeight={700} ml={1}>{translateWord(locale,"Bus")} - {plateNumber}</Typography>
        <Typography  ml={1}>{driverName}</Typography>
    </Box>)
}

export default BusBox;