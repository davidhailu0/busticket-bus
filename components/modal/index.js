import {Button,Box,Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Avatar,Divider} from"@mui/material"
import CloseIcon from '@mui/icons-material/Close';
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

export default function Modal({open,setOpen,employeeName,employeePhone,employeeRole,employeeBusNumber}) {
  const router = useRouter()
  const {locale} = useLocale()

 const handleClose = ()=>{
    setOpen(false)
 }

 const editEmployeeInfo = async()=>{
    handleClose()
    const employeeId = sessionStorage.getItem("employeeId")
    await router.push(`employees/${employeeId}`)
 }

  return (
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title"/>
        <DialogContent sx={{height:"220px",width:"400px",px:2.5}}>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",my:1.5}}>
            <Avatar/>
            <Typography>{employeeName}</Typography>
          </Box>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",my:1.5}}>
            <Typography>{translateWord(locale,"Role")}</Typography>
            <Typography>{translateWord(locale,employeeRole)}</Typography>
          </Box>
          <Divider/>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",my:1.5}}>
            <Typography>{translateWord(locale,"Phone Number")}</Typography>
            {employeePhone.map((phone,ind)=><Typography key={ind}>{phone}</Typography>)}
          </Box>
          <Divider/>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",my:1.5}}>
            <Typography>{translateWord(locale,"Plate Number")}</Typography>
            <Typography>{employeeBusNumber}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{display:"flex",justifyContent:"space-between",width:"100%",mb:1}}>
            <Button onClick={handleClose} sx={{width:"150px",textTransform:"none",boxShadow: "0px 0px 13.000000953674316px 0px #00000026"}}>{translateWord(locale,"Cancel")}</Button>
            <Button variant='contained' sx={{width:"150px",textTransform:"none"}} onClick={editEmployeeInfo}>
                {translateWord(locale,"Edit")}
            </Button>
        </DialogActions>
      </BootstrapDialog>
  );
}