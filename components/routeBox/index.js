import {Box,Typography} from "@mui/material"
import { translateWord } from "../../utils/languageTranslation";
import { useLocale } from "../../utils/LanguageContext";

const RouteBox = ({destination,numberSelected,onClick})=>{
    const {locale} = useLocale()
    return (<Box sx={{width:"230px",height:"150px",display:"flex",justifyContent:"space-between",flexDirection:"column",py:3,pl:2.5,background:"#fff",cursor:"pointer"}} onClick={onClick}>
            <Typography ml={1}>{translateWord(locale,destination)}</Typography>
            <Typography ml={1}>{numberSelected} {translateWord(locale," Routes Selected")}</Typography>
    </Box>)
}

export default RouteBox;