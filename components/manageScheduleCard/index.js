import {Box,Typography,Button} from "@mui/material"
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useRouter } from "next/router";
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const ManageScheduleCard = ({id,departure,destination,departureDate,returnDate,plateNumber})=>{
    const router = useRouter()
    const {locale} = useLocale()

    const goToEditBusSchedule = ()=>{
        router.push(`schedule/${id}`)
    }
    return (<Box sx={{display:"flex",width:"800px",boxShadow:"0px 0px 10px 0px #00000026",background:"#fff",p:"1rem",py:"2rem",justifyContent:"space-between",my:"1rem"}}>
        <Box>
            <Box sx={{display:"flex",my:"0.5rem",p:"1rem",border:"solid 1px black",width:"506.67px"}}>
                    <Box sx={{display:"flex",flexDirection:"column"}}>
                        <Box sx={{display:"flex",alignItems:"center"}}><MyLocationIcon/> <Typography ml={departure.length<=7?4.5:2} width={"100px"}>{translateWord(locale,departure)}</Typography></Box>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                        <Box sx={{display:"flex",alignItems:"center"}}><LocationOnIcon/> <Typography ml={destination.length<=7?4.5:2} width={"100px"}>{translateWord(locale,destination)}</Typography></Box>
                    </Box>
                    <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-between",ml:"2rem",flexGrow:3}}>
                        <Box sx={{display:"grid",gridTemplateColumns:"auto auto auto",gap:"1rem"}}>
                            {departureDate.reduce((data,curr)=>[...data,...curr],[]).map(tm=>{
                                let modifiedDate = new Date(parseInt(tm)).toDateString().split(" ")
                                modifiedDate[0] = translateWord(locale,modifiedDate[0])
                                modifiedDate[1] = translateWord(locale,modifiedDate[1])
                                return (<Box sx={{display:"flex",justifyContent:"center",border:"solid 1px #768463"}}>
                                            {modifiedDate.join(" ")}
                                    </Box>)
                            })}
                        </Box>
                    </Box>
            </Box>
            <Box sx={{display:"flex",my:"0.5rem",p:"1rem",border:"solid 1px black",width:"506.67px"}}>
            <Box sx={{display:"flex",flexDirection:"column"}}>
                        <Box sx={{display:"flex",alignItems:"center"}}><MyLocationIcon/> <Typography ml={destination.length<=7?4.5:2} width={"100px"}>{translateWord(locale,destination)}</Typography></Box>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                            <span style={{background:"black",borderRadius:"50%",height:"5px",width:"5px",margin:"3px 0",marginLeft:"5rem"}}></span>
                        <Box sx={{display:"flex",alignItems:"center"}}><LocationOnIcon/> <Typography ml={departure.length<=7?4.5:2} width={"100px"}>{translateWord(locale,departure)}</Typography></Box>
                    </Box>
                    <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-between",ml:"2rem",flexGrow:3}}>
                        <Box sx={{display:"grid",gridTemplateColumns:"auto auto auto",gap:"1rem"}}>
                            {returnDate.reduce((data,curr)=>[...data,...curr],[]).map(tm=>{
                                let modifiedDate = new Date(parseInt(tm)).toDateString().split(" ")
                                modifiedDate[0] = translateWord(locale,modifiedDate[0])
                                modifiedDate[1] = translateWord(locale,modifiedDate[1])
                                return (<Box sx={{display:"flex",justifyContent:"center",border:"solid 1px #768463"}}>
                                            {modifiedDate.join(" ")}
                                    </Box>)
                            })}
                        </Box>
                    </Box>
            </Box>
        </Box>
        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
                <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <DirectionsBusIcon/>
                    <Typography ml={3}>{plateNumber}</Typography>
                </Box>
                <Button variant="contained" sx={{textTransform:"none",width:"197px",height:"60px",fontWeight:700,fontSize:"20px"}} onClick={goToEditBusSchedule}>{translateWord(locale,"View")}</Button>
        </Box>
    </Box>)
} 

export default ManageScheduleCard