import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Typography,TextField,InputAdornment,Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {gql,useMutation} from "@apollo/client"
import DialogContent from '@mui/material/DialogContent';
import Phone from '@mui/icons-material/Phone';
import { ToastContainer,toast } from 'react-toastify';
import { BarLoader} from 'react-spinners';
import Dialog from '@mui/material/Dialog';
import {validateEmail, validatePhone} from "../../utils/validate"
import ContainedButton from '../Button/customContainedButton';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';
import OTPInputModal from '../OTPInputModal';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  position:'fixed',
  top:"48vh",
  left:"45vw",
  zIndex:"100"
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const MUTATESENDOTP = gql`
  mutation forgotPasswordBusCompany($credential:String){
    forgotPasswordBusCompany(credential:$credential){
      _id
      OTP
    }
  }`

export default function ForgotPasswordModal({open,handleClose}) {
    const [credential,setCredential] = useState("")
    const [credentialError,setCredentialError] = useState(false)
    const [sendOTP] = useMutation(MUTATESENDOTP)
    const [userID,setUserID] = useState("")
    const [openOTPModal,setOpenOTPModal] = useState(false)
    const {locale} = useLocale()
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
      console.log(userID)
      if(userID!==""){
        setOpenOTPModal(true)
      }
    },[userID])
  
    const checkValues = ()=>{
      let returnedValue = true
      if(credential.trim()===""||credentialError){
        returnedValue = false
        setCredentialError(true)
      }
      return returnedValue
    }

    const handleCloseOTPModal = ()=>{
      setOpenOTPModal(false)
      setUserID("")
      handleClose()
    }
  
    const sendOTPClicked = async()=>{
      if(checkValues()){
        try{
          setLoading(true)
          const sendOTPData = await sendOTP({variables:{
            credential:credential
          }})
          setLoading(false)
          toast.success("Check your phone or Email, OTP has been sent")
          setUserID(sendOTPData['data']['forgotPasswordBusCompany']['_id'])
        }
        catch(e){
          setLoading(false)
          toast.error(e.message)
        }
      }
    }
  
    const handleCredentialChange = (e)=>{
      setCredential(e.target.value.trim())
      if(validatePhone(e.target.value.trim())||validateEmail(e.target.value)){
        setCredentialError(false)
      }
      else{
        setCredentialError(true)
      }
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
          <Box sx={{display:loading?"flex":"none",justifyContent:"center",alignItems:"center",position:"fixed",height:"100vh",width:"100vw",zIndex:200,top:0,right:0,left:0,bottom:0,background:"rgba(200,200,200,0.4)"}}>
            <BarLoader color={'#36D7B7'}loading={loading} cssOverride={override} size={100} height={"10px"} width={"100px"}/>
          </Box>
          <DialogContent sx={{width:{md:"848px",xs:"320px"},height:"520px"}}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"center",p:4,px:0}}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"start",width:"100%",pl:{md:"9rem",xs:0},mb:"2rem"}}>
                <Typography fontWeight={700} fontSize={"20px"} color={"#CCCCCC"}>{translateWord(locale,"Forgot Password")}</Typography>
                <Typography mt={1} mb={3}>{translateWord(locale,"Enter Phone Number or Email")} </Typography>
            </Box>
            <Tooltip title={credentialError?"Please Enter a valid Phone Number":""}>
            <TextField InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                              <Phone/>
                              </InputAdornment>
                          )
                      }}  label={translateWord(locale,"Phone Number or Email")} name="phone number" id="phone number" value={credential} sx={{width:{md:"522px",xs:"290px"},my:"1rem"}} onChange={handleCredentialChange} error={credentialError}/>
            </Tooltip>    
            <Box sx={{display:"flex",justifyContent:"flex-end",width:"100%",pt:2,pr:17.2}}>
                    <Button variant='text' sx={{color:"#768463",textTransform:"none",fontWeight:700}} onClick={handleClose}>
                        {translateWord(locale,"Cancel")}
                    </Button>
                 </Box>    
                  <Box sx={{display:"flex",justifyContent:"center",width:"100%",pt:2,}}>
                    <ContainedButton width='522px' height='48px' onClick={sendOTPClicked}>
                        {translateWord(locale,"Send OTP")}
                    </ContainedButton>
                 </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
        <OTPInputModal open={openOTPModal} handleClose={handleCloseOTPModal} resendOTP={sendOTPClicked} userID={userID}/>
        </>
    );
  }