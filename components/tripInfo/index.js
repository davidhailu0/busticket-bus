import { Box,Typography } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EastIcon from '@mui/icons-material/East';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';

const TripInfo = ({departure,destination,departureDate,departureTime})=>{
    const {locale} = useLocale()
    let modifiedDate =  new Date(parseInt(departureDate)).toDateString().split(" ")
    modifiedDate[0] = translateWord(locale,modifiedDate[0])
    modifiedDate[1] = translateWord(locale,modifiedDate[1])
    return (<Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-between",width:"372px"}}>
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <MyLocationIcon sx={{color:"#768463"}}/>
            <Typography ml={0.6}>{departure}</Typography>
            <EastIcon sx={{color:"#768463"}}/>
            <LocationOnIcon sx={{color:"#768463"}}/>
            <Typography ml={3}>{destination}</Typography>
        </Box>
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mt:2}}>
            <Box sx={{display:"flex",alignItems:"center"}}>
                <CalendarTodayIcon sx={{color:"#768463"}}/>
                <Typography ml={4}>{modifiedDate.join(" ")}</Typography>
            </Box>
            <Box sx={{display:"flex",alignItems:"center"}}>
                <AccessTimeIcon sx={{color:"#768463"}}/>
                <Typography ml={5.8}>{departureTime}</Typography>
            </Box>
        </Box>
    </Box>
    )
}

export default TripInfo;