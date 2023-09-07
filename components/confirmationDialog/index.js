import {Button,Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {Typography} from"@mui/material"
import CloseIcon from '@mui/icons-material/Close';
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

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2}} {...other}>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function AddRouteConfirm({open,addAnotherCallBack}) {

const router = useRouter()
const {selectedRoute,selectedDestinations} = useNumberOfBusContext()
const {locale} = useLocale()

const goToHomePage = ()=>{
    router.replace("routes")
}

return (
        <BootstrapDialog
        onClose={()=>{}}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title"/>
        <DialogContent sx={{height:"300px",width:{md:"500px",xs:"320px"},px:2.5}}>
          <Typography mt={5}>{translateWord(locale,selectedRoute)+translateWord(locale,"Routes to has been added. Do you want to add routes for another destination ?")}</Typography>
            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",mt:"7rem"}}>
                {Object.keys(selectedDestinations).length!==0&&<Button variant='outlined' sx={{width:{md:"197px",xs:"150px"},fontWeight:700,height:"60px",textTransform:"none"}} onClick={goToHomePage}>{translateWord(locale,"Finish")}</Button>}
                <Button variant='contained' sx={{width:{md:"197px",xs:"150px"},fontWeight:700,height:"60px",textTransform:"none"}} onClick={addAnotherCallBack}>{translateWord(locale,"Add Routes")}</Button>
            </Box>
        </DialogContent>
      </BootstrapDialog>
);
}