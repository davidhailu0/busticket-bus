import { Card, Grid,Typography,Button,Box } from "@mui/material";
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import EastIcon from '@mui/icons-material/East';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from "next/router";
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const ManageTripCard = ({departure,destination,passengersCount,departureTime,tripID})=>{
    const router = useRouter()
    const {locale} = useLocale()

    const goToEditTrip = ()=>{
        router.push(`trips/${tripID}`)
    }
    return (
        <Card sx={{height:{md:"164px",xs:"auto"},p:2,mb:"1rem"}}>
            <Grid container height={"100%"} spacing={3}>
                <Grid md={8} item sx={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100%"}}>
                    <Box sx={{display:"flex",alignItems:"center"}}>
                        <Box sx={{display:"flex",alignItems:"center"}}>
                            <FmdGoodIcon sx={{color:"#768463",mr:"1rem"}}/>
                            <Typography>{translateWord(locale,"From")} {translateWord(locale,departure)}</Typography>
                        </Box>
                        <EastIcon sx={{color:"#768463",mx:"1rem"}} fontSize={"large"}/>
                        <Box sx={{display:"flex",alignItems:"center"}}>
                            <FmdGoodIcon sx={{color:"#768463",mr:"1rem"}}/>
                            <Typography>{translateWord(locale,"To")} {translateWord(locale,destination)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{display:"flex",alignItems:"center"}}>
                        <CheckCircleOutlineIcon sx={{color:"#768463",mr:"1rem"}}/>
                        <Typography sx={{color:"#768463"}}>{passengersCount} {translateWord(locale," Seat Booked")}</Typography>
                    </Box>
                    <Box sx={{display:"flex",alignItems:"center"}}>
                        <AccessTimeIcon sx={{color:"#768463",mr:"1rem"}}/>
                        <Box mr="1rem">
                            {translateWord(locale,"Departure Time")}
                        </Box>
                        <Typography fontWeight={700}>
                            {departureTime}
                        </Typography>
                    </Box>
                </Grid>
                <Grid md={4} xs={12} item sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:{md:"center",xs:"flex-start"}}}>
                    <Button variant={"contained"} sx={{width:"197px",height:"60px",fontWeight:700,fontSize:"20px",textTransform:"none"}} onClick={goToEditTrip}>{translateWord(locale,"Edit")}</Button>
                </Grid>
            </Grid>
        </Card>
    )
}

export default ManageTripCard;