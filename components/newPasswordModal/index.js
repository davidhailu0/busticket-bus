import { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {gql,useMutation} from "@apollo/client"
import DialogContent from '@mui/material/DialogContent';
import { ToastContainer,toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import LockIcon from '@mui/icons-material/Lock';
import ContainedButton from '../Button/customContainedButton';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';
import { validatePassword } from '../../utils/validate';
import { useCookie } from '../../utils/cookies';
import { useRouter } from 'next/router';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const MUTATECHANGEPASSWORD = gql`
  mutation changePasswordBusCompany($userID:ID,$newPassword:String){
    changePasswordBusCompany(userID:$userID,newPassword:$newPassword){
      token
    }
  }`

export default function NewPasswordModal({open,handleClose,userID}) {
    const [newPassword,setNewPassword] = useState("")
    const [newPasswordError,setNewPasswordError] = useState(false)
    const [confirmPassword,setConfirmPassword] = useState("")
    const [confirmPasswordError,setConfirmPasswordError] = useState(false)
    const [changePassword] = useMutation(MUTATECHANGEPASSWORD)
    const [getCookie,setCookie] = useCookie()
    const {locale} = useLocale()
    const router = useRouter()
  
    const checkValues = ()=>{
      let returnedValue = true
      if(newPassword.trim()===""){
        setNewPasswordError(true)
        returnedValue = false
      }
      if(confirmPassword.trim()===""){
        setConfirmPasswordError(true)
        returnedValue = false
      }
      if(newPassword!==confirmPassword){
        setConfirmPasswordError(true)
        returnedValue = false
      }
      return returnedValue
    }
  
    const changePasswordClicked = async()=>{
      if(checkValues()){
        try{
          const changePasswordData = await changePassword({variables:{
            userID,newPassword:newPassword
          }})
          setCookie("token",changePasswordData["data"]["changePasswordBusCompany"]["token"])
          toast.success("Password Successfully Changed")
          router.replace("/home")
        }
        catch(e){
          toast.error(e.message)
          console.log(JSON.stringify(e))
        }
      }
    }

    const handleNewPasswordChange = (e)=>{
        setNewPassword(e.target.value)
        if(validatePassword(e.target.value)){
            setNewPasswordError(false)
        }
        else{
            setNewPasswordError(false)
        }
    }

    const handleConfirmPasswordChange = (e)=>{
        setConfirmPassword(e.target.value)
        if(validatePassword(e.target.value)){
            setConfirmPasswordError(false)
        }
        else{
            setConfirmPasswordError(false)
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
          <DialogContent sx={{width:{md:"848px",xs:"320px"},height:"520px"}}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"center",p:4,px:0}}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"start",width:"100%",pl:{md:"9rem",xs:0},mb:"2rem"}}>
                <Typography fontWeight={700} fontSize={"20px"} color={"#CCCCCC"}>{translateWord(locale,"OTP")}</Typography>
                <Typography mt={1} mb={3}>{translateWord(locale,"Enter OTP")} </Typography>
            </Box>
            <TextField InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <LockIcon/>
                            </InputAdornment>
                        )
                    }} label={translateWord(locale,"New Password")} name="password" id="password" value={newPassword} type={"password"} sx={{width:{md:"522px",xs:"290px"},my:"1rem"}} onChange={handleNewPasswordChange} error={newPasswordError}/>
            <Tooltip title={confirmPasswordError&&confirmPassword===""?"Please Enter Password Again":confirmPasswordError&&confirmPassword!==newPassword?"The Passwords don't match":""}>
            <TextField InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <LockIcon/>
                            </InputAdornment>
                        )
                    }} label={translateWord(locale,"Confirm Password")} name="password" id="password" value={confirmPassword} type={"password"} sx={{width:{md:"522px",xs:"290px"},my:"1rem"}} onChange={handleConfirmPasswordChange} error={confirmPasswordError}/>
            </Tooltip>   
                  <Box sx={{display:"flex",justifyContent:"center",width:"100%",pt:2,}}>
                    <ContainedButton width='522px' height='48px' onClick={changePasswordClicked}>
                        {translateWord(locale,"Change Password")}
                    </ContainedButton>
                 </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
        </>
    );
  }