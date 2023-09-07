import { Box,Typography } from "@mui/material";
import Image from "next/image"
import SmallBus from "../../Assets/images/smallBus.svg"
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const BusPlateNumber = ({plateNumber,onClick,ind})=>{
    const {locale} = useLocale()
    return (<Box id={"bus"+ind} sx={{width:"217px",height:"153px",backgroundColor:"#fff",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",p:"1rem",py:"1.5rem",my:"1rem",cursor:"pointer"}} onClick={onClick}>
        <Typography fontWeight={700}>{translateWord(locale,"Bus")} - {plateNumber}</Typography>
        <Image src={SmallBus} height={"24.86px"} width={"50px"}/>
    </Box>)
}

export default BusPlateNumber;