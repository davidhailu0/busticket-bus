import {Button,Box,Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CustomAccordion from '../customAccordion';
import { useNumberOfBusContext } from '../../utils/numberOfBusesContext';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function RouteDisplayDialog({open,setOpen}) {

const router = useRouter()
const {selectedCheckBox,updateBusCompany,setSelectedCheckBox,setSelectedDestinations,selectedDestinations,id} = useNumberOfBusContext()
const {token,locale} = useLocale()

const handleClose = ()=>{
    setOpen(false)
}

 const returnPage = ()=>{
  setOpen(false)
  if(!router.asPath.includes("/routeAddPage")){
    router.push("/routeAddPage")
  }
 }

 const goToHomePage = async()=>{
      await updateBusCompany({variables:{
        inputID:id,
        inputBusCompany:{
            routes:selectedCheckBox
        },
        activity:{
          companyId:token._id,
          name:token.accountName
        }
    }})
    router.reload()
 }

  return (
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogContent sx={{height:"450px",width:{md:"600px",xs:"320px"},px:2.5,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div>
                <Typography mt={5} sx={{color:"#CCCCCC",fontSize:"20px"}}>{translateWord(locale,"Selected Routes")}</Typography> 
                {Object.entries(selectedDestinations).map((curr,ind)=><CustomAccordion key={ind} routeList={curr[1]} selectedCheckBox={selectedCheckBox} setSelectedCheckBox={setSelectedCheckBox} selectedRoute={curr[0]} setSelectedDestinations={setSelectedDestinations}/>)}
            </div>
            <Box sx={{display:"flex",justifyContent:"space-between"}}>
                <Button variant='outlined' sx={{width:{md:"197px",xs:"140px"},fontWeight:700,height:"60px",textTransform:"none"}} onClick={returnPage}>{translateWord(locale,"Add More")}</Button>
                <Button variant='contained' sx={{width:{md:"197px",xs:"140px"},fontWeight:700,height:"60px",textTransform:"none"}} onClick={goToHomePage}>{translateWord(locale,"Confirm")}</Button>
            </Box>
        </DialogContent>
      </BootstrapDialog>
  );
}