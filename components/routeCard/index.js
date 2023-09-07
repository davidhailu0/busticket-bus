import React from "react";
import { Box,Typography } from "@mui/material"
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import CheckBox from "../checkBox/customCheckBox"
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const RouteCard = ({departure,destination,subRoutes,id,row})=>{
    const {locale} = useLocale()
    return (<Box sx={{display:"flex",flexDirection:{md:"row",xs:row&&"column"},alignItems:"center",overFlowX:"scroll"}}>
        <CheckBox departure={departure} destination={destination} subRoutes={subRoutes} label={id} />
        <Typography sx={{fontSize:{md:"16px",xs:"12px"}}}>{translateWord(locale,departure)}</Typography>
        <DoubleArrowIcon sx={{transform:{md:"none",xs:row&&"rotate(90deg)"}}}/>
        {subRoutes.map((rte,ind)=>{
            return (<React.Fragment key={ind}>
                <Typography sx={{fontSize:{md:"16px",xs:"12px"}}}>{translateWord(locale,rte["destination"])}</Typography>
                <DoubleArrowIcon sx={{transform:{md:"none",xs:row&&"rotate(90deg)"}}}/>
            </React.Fragment>)
        })}
        <Typography sx={{fontSize:{md:"16px",xs:"12px"}}}>{translateWord(locale,destination)}</Typography>
    </Box>)
}

export default RouteCard