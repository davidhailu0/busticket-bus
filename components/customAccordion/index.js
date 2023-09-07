import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Typography} from"@mui/material"
import RouteCard from '../routeCard';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';

export default function CustomAccordion({routeList,selectedCheckBox,setSelectedCheckBox,selectedRoute,setSelectedDestinations}){
    const {locale} = useLocale()
    return (<Accordion defaultExpanded>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>{translateWord(locale,selectedRoute)}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{display:"grid",gridTemplateColumns:{md:"auto",xs:"auto auto auto"}}}>
        {routeList.map(({_id,departure,destination,subRoutes})=>{
          if(selectedCheckBox.includes(_id)){
            return <RouteCard row={true} key={_id} id={_id} departure={departure} destination={destination} selectedCheckBox={selectedCheckBox} subRoutes={subRoutes} setSelectedCheckBox={setSelectedCheckBox} selectedRoute={selectedRoute} setSelectedDestinations={setSelectedDestinations}/>
          }
        })}
    </AccordionDetails>
  </Accordion>)
}