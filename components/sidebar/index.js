import {Box} from "@mui/material"
import BarChartIcon from '@mui/icons-material/BarChart';
import RouteIcon from '@mui/icons-material/Route';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LuggageIcon from '@mui/icons-material/Luggage';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import LinkComponent from "../../components/Link";
import busLogo from "../../Assets/images/oliveLogo.png"
import { createTheme,ThemeProvider } from "@mui/material";
import { Typography } from "@mui/material";
import { Avatar } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Relation from "../../Assets/images/relation.svg"
import Image from "next/image";
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const drawerWidth = 260;

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#9CA3AF",
        },
    }
  }) 

const drawer = (companyName,role)=>{
  const {locale} = useLocale()

  return(
    <div style={{textAlign:"center",height:"100vh",backgroundColor:"#fff",boxShadow:"-10px -10px 10px 0px #FFFFFF inset,10px 10px 10px 0px #AEAEC040 inset,10px 10px 30px 0px #AEAEC066,-10px -10px 30px 0px #FFFEFE"}}>
      <Box sx={{mt:"1rem",display:"flex",justifyContent:"start",px:"0.5rem"}}>
        <Image src={busLogo} alt="My Bus Logo" height={"50"} width={"63"}/>
      </Box>
      <Box sx={{display:"flex",height:"80px",justifyContent:"center",alignItems:"center",background:"#fff",mt:"2rem",mx:3}}>
          <Avatar/>
          <Typography color="#629460" ml={3} sx={{fontWeight:700}}>
            {companyName}
          </Typography>
      </Box>
      <List>
      <ThemeProvider theme={customTheme}>
        <LinkComponent to={"/home"} label={translateWord(locale,"Dashboard")}><BarChartIcon sx={{color:"#629460"}}/></LinkComponent>
        {role==="TRIP MANAGER"&&<LinkComponent to={"/trips"} label={translateWord(locale,"Trips")}><LuggageIcon sx={{color:"#629460"}}/></LinkComponent>}
        <LinkComponent to={"/relate"} label={translateWord(locale,"Match")}><Image src={Relation} height={"24px"} width={"24px"}/></LinkComponent>
        {role==="TRIP MANAGER"&&<LinkComponent to={"/schedule"} label={translateWord(locale,"Manage Schedule")}><HistoryIcon sx={{color:"#629460"}}/></LinkComponent>}
        <LinkComponent to={"/buses"} label={translateWord(locale,"Buses")}><DirectionsBusIcon sx={{color:"#629460"}}/></LinkComponent>
        <LinkComponent to={"/routes"} label={translateWord(locale,"Routes")}><RouteIcon sx={{color:"#629460"}}/></LinkComponent>
        <LinkComponent to={"/employees"} label={translateWord(locale,"Staff")}><PeopleIcon sx={{color:"#629460"}}/></LinkComponent>
        {role==="BUS COMPANY"&&<LinkComponent to={"/activity"} label={translateWord(locale,"Activity Logs")}><TimelineIcon sx={{color:"#629460"}}/></LinkComponent>}
        {role==="BUS COMPANY"&&<LinkComponent to={"/account"} label={translateWord(locale,"Account")}><AccountCircleIcon sx={{color:"#629460"}}/></LinkComponent>}
      </ThemeProvider>
      </List>
    </div>
  );
}
const Sidebar = ({drawerState,companyName,role})=>{
    return (<Box
        sx={{background:"#879376",width: { sm: drawerWidth },fontFamily:"Open Sans", flexShrink: { sm: 0 },position:"fixed",top:"0",bottom:"0",left:"0",zIndex:"999",display:{xs:drawerState?"block":"none",md:"block"}}}
      >
        <Drawer
          variant="permanent"
          sx={{
            backgroundColor:"#111827",
            display: { xs: drawerState?"block":"none", md:"block" },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            position:"fixed",left:"0",top:"0",bottom:"0"
          }}
        >
          {drawer(companyName,role)}
        </Drawer>
        </Box>
        )
}

export default Sidebar;