import { useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Typography, } from '@mui/material';
import { styled } from '@mui/material/styles';
import {gql,useMutation} from "@apollo/client"
import DialogContent from '@mui/material/DialogContent';
import { ToastContainer,toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import ContainedButton from '../Button/customContainedButton';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';
import OtpInput from 'react18-input-otp';
import style from '../../styles/otp.module.css'
import NewPasswordModal from '../newPasswordModal';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const MUTATESENDOTP = gql`
  mutation  checkOTPBusCompany($companyID:ID,$OTP:String){
    checkOTPBusCompany(companyID:$companyID,OTP:$OTP)
  }`

export default function OTPInputModal({open,handleClose,resendOTP,userID}) {
    const [otpValue,setOTPValue] = useState("")
    const [verifyOTP] = useMutation(MUTATESENDOTP)
    const [openNewPassword,setOpenNewPasswordModal] = useState(false)
    const {locale} = useLocale()
  
    const checkValues = ()=>{
      let returnedValue = true
      if(otpValue.trim()===""||otpValue.length!=6){
        returnedValue = false
      }
      return returnedValue
    }
  
    const verifyOTPClicked = async()=>{
      if(checkValues()){
        try{
          await verifyOTP({variables:{
            companyID:userID,OTP:otpValue
          }})
         setOpenNewPasswordModal(true)
        }
        catch(e){
          toast.error(e.message)
        }
      }
    }
  
    const handleOTPChange = (otp)=>{
      setOTPValue(otp)
    }

    const handleCloseNewPassword = ()=>{
        handleClose()
        setOpenNewPasswordModal(false)
    }
  
    return (
        <>
        <ToastContainer position="top-center"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"/>
          <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          maxWidth="md"
        >
          <DialogContent sx={{width:{md:"848px",xs:"320px"},height:"520px"}}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"center",p:4,px:0}}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"start",width:"100%",pl:{md:"9rem",xs:0},mb:"2rem"}}>
                <Typography fontWeight={700} fontSize={"20px"} color={"#CCCCCC"}>{translateWord(locale,"OTP")}</Typography>
                <Typography mt={1} mb={3}>{translateWord(locale,"Enter OTP")} </Typography>
            </Box>
            <OtpInput value={otpValue} onChange={handleOTPChange} numInputs={6} separator={<span>-</span>} inputStyle={style.otpStyle}/> 
            <Box sx={{display:"flex",justifyContent:"flex-end",width:"100%",pt:2,pr:18}}>
                    <Button variant='text' sx={{color:"#768463",textTransform:"none",fontWeight:700}} onClick={resendOTP}>
                        {translateWord(locale,"Resend OTP")}
                    </Button>
                 </Box>    
                  <Box sx={{display:"flex",justifyContent:"center",width:"100%",pt:2,}}>
                    <ContainedButton width='522px' height='48px' onClick={verifyOTPClicked}>
                        {translateWord(locale,"Submit")}
                    </ContainedButton>
                 </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
        <NewPasswordModal open={openNewPassword} handleClose={handleCloseNewPassword} userID={userID}/>
        </>
    );
  }