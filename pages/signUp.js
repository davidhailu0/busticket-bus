import { useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {InputAdornment,Tooltip,IconButton} from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Link from "next/link"
import jwt from "jsonwebtoken"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { PacmanLoader } from 'react-spinners';
import { useMutation,gql } from '@apollo/client';
import { useRouter } from 'next/router';
import whiteLogo from "../Assets/images/whiteLogo.png"
import {validateEmail,validateName,validateNumber,validatePassword,validatePhone} from "../utils/validate"
import { uploadFile } from '../utils/request-api';
import {useCookie} from '../utils/cookies';
import {languages,translateWord,changeLanguage } from '../utils/languageTranslation';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const MUTATESIGNUP = gql`
    mutation addBusCompany($input:BusCompanyCreateInput!){
      addBusCompany(busCompany:$input){
        _id
        name
        phoneNumber
        email
        password
        active
        logo
        license
        token
      }
    }
`

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" mb={3} align="center" {...props}>
        {'Copyright © '}
        <Link href="/">
          <a style={{color:"#629460"}}>My Bus</a>
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    position:'fixed',
    top:"40vh",
    left:"40vw",
    zIndex:"100"
  };

  const customTheme = createTheme({
    palette:{
        primary:{
            main:"#629460",
        },
    }
})

const customThemeBTN = createTheme({
  palette:{
      primary:{
          main:"#fff",
      },
  }
})

const SignUp = ({locale})=>{
    const [loading,setLoading] = useState(false);
    const [name,setName] = useState("")
    const [nameError,setNameError] = useState(false)
    const [phoneNumber,setphoneNumber] = useState("")
    const [phoneError,setPhoneError] = useState(false)
    const [email,setEmail] = useState("")
    const [emailError,setEmailError] = useState(false)
    const [passwordValue,setPasswordValue] = useState("")
    const [passwordError,setPasswordError] = useState(false)
    const [numberOfBuses,setNumberOfBuses] = useState("")
    const [numberOfBusesError,setNumberOfBusError] = useState(false)
    const [logoName,setLogoName] = useState(null)
    const [logoNameError,setLogoNameError] = useState(false)
    const [licenseName,setLicenseName] = useState(null)
    const [licenseNameError,setLicenseNameError] = useState(false)
    const [addBusCompany] = useMutation(MUTATESIGNUP)
    const [getCookie,setCookie] = useCookie()
    const [newLocale,setNewLocale] = useState(locale)
    const [language,setLanguage] = useState(null)
    const router = useRouter()

    const openLanguage = (event)=>{
      setLanguage(event.currentTarget)
    }
  
    const closeLanguage = ()=>{
        setLanguage(null)
    }

    const changeSelectedLanguage = (locale)=>{
        changeLanguage(locale,setCookie)
        setNewLocale(locale)
        closeLanguage()
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(validateInput()){
            setLoading(true)
            try{
              const resp = await addBusCompany({variables:{input:{
                name,
                phoneNumber,
                email,
                password: passwordValue,
                numberOfBuses:parseInt(numberOfBuses)
              }}})
              setCookie("token",resp["data"]["addBusCompany"]["token"])
              sessionStorage.setItem("busID",resp["data"]["addBusCompany"]["_id"])
              sessionStorage.setItem("busProvider",resp["data"]["addBusCompany"]["name"])
              await uploadFile(logoName,"LogoFile",resp["data"]["addBusCompany"]["token"])
              await uploadFile(licenseName,"LicenseFile",resp["data"]["addBusCompany"]["token"])
              setLoading(false)
              await router.replace("/home")
            }
            catch(e){
              toast.error(e.message)
              setLoading(false)
            }
        }
    }

    const handleUploadFile = async(e,type)=>{
      if(e.target.files[0]){
          if(type==="LogoFile"){
              setLogoNameError(false)
              setLogoName(e.target.files[0])
          }
          else{
              setLicenseNameError(false)
              setLicenseName(e.target.files[0])
          }
      }
  }

    const handleNameChange = (e)=>{
      setName(e.target.value)
      if(validateName(e.target.value)){
        setNameError(false)
      }
      else{
        setNameError(true)
      }
    }

    const handlePhoneChange = (e)=>{
      setphoneNumber(e.target.value)
      if(validatePhone(e.target.value)){
        setPhoneError(false)
      }
      else{
        setPhoneError(true)
      }
    }

    const handleEmailChange = (e)=>{
      setEmail(e.target.value)
      if(validateEmail(e.target.value)){
        setEmailError(false)
      }
      else{
        setEmailError(true)
      }
    }

    const handlePasswordChange = (e)=>{
      setPasswordValue(e.target.value)
      if(validatePassword(e.target.value)){
        setPasswordError(false)
      }
      else{
        setPasswordError(true)
      }
    }

    const handleBusNumberChange = (e)=>{
      setNumberOfBuses(e.target.value)
      if(validateNumber(e.target.value)){
        setNumberOfBusError(false)
      }
      else{
        setNumberOfBusError(true)
      }
    }

    const goToSignIn = ()=>{
      router.replace("/")
    }

    const validateInput = ()=>{
      let returnedValue = true;
      if(name===""||nameError){
        returnedValue = false
        setNameError(true)
      }
      if(passwordValue===""||passwordError){
        returnedValue = false
        setPasswordError(true)
      }
      if(phoneNumber===""||phoneError){
        returnedValue = false
        setPhoneError(true)
      }
      if(email===""||emailError){
        returnedValue = false
        setEmailError(true)
      }
      if(numberOfBuses===""||numberOfBusesError){
        returnedValue = false
        setNumberOfBusError(true)
      }
      if(!logoName){
        setLogoNameError(true)
        returnedValue = false
      }
      if(!licenseName){
        setLicenseNameError(true)
        returnedValue = false
      }
        return returnedValue
    }
    return (<ThemeProvider theme={customTheme}>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
          <div style={{height:"100vh",width:'100%',position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:'10',display:loading?'block':'none',backgroundColor:'rgba(240,240,240,0.7)'}}></div>
          {/* <ForgotPasswordModal modalStatus={status} changeStatus={setStatus} setLoading={setLoading}/> */}
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Box sx={{position:"absolute",top:"25px",right:{md:"35px",xs:4},zIndex:5}}>
                    <IconButton onClick={openLanguage}>
                      <LanguageIcon/>
                    </IconButton>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={language}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(language)}
                      onClose={closeLanguage}
                    >
                    {languages.map(({lang,locale}) => {
                      if(getCookie("NEXT_LOCALE")!==locale)
                      return (
                      <MenuItem key={lang} onClick={()=>changeSelectedLanguage(locale)}>
                        <Typography textAlign="center">{lang}</Typography>
                      </MenuItem>
                    )
                    }
                    )}
                    </Menu>
                  </Box>
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                background:`#629460`,
                transform:"skewX(-12deg) translateX(-13rem)",
                display:"flex",
                flexDirection:"column",
                alignItems:"center"
              }}>
                <Box sx={{transform:"skewX(12deg)",position:"absolute",top:"1.8rem",left:"14.3rem"}}>
                  <Image src={whiteLogo.src} width={63} height={50}/>
                </Box>
                <Box sx={{transform:"skewX(12deg) translateX(5rem)",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",px:"7rem",mt:18}}>
                  <Typography sx={{fontFamily:"Open Sans",color:"#fff",fontWeight:"600",fontSize:"24px",lineHeight:"27.24px"}}>{translateWord(newLocale,"Already have an account ?")}</Typography>
                  <Typography sx={{fontFamily:"Open Sans",pl:"2rem",color:"#fff",fontSize:"20px",mt:"1rem"}}>{translateWord(newLocale,"Sign Up to manage your company and provide more efficient service.")}</Typography>
                  <ThemeProvider theme={customThemeBTN}>
                    <Button variant='outlined' sx={{mt:"4rem",color:"#fff",textTransform:"none"}} onClick={goToSignIn}>{translateWord(newLocale,"Sign In")}</Button>
                  </ThemeProvider>
                </Box>
              </Grid>
            <Grid item xs={12} sm={8} md={5}>
              <Box
                sx={{
                  mt: 15,
                  mr: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent:"center",
                  alignItems: 'center',
                }}
                component='form'
                noValidate
                onSubmit={handleSubmit}
              >
                <Typography sx={{alignSelf:"flex-start",fontFamily:"Open Sans",fontWeight:"700",fontSize:"32px",lineHeight:"43.58px"}}>
                  {translateWord(newLocale,"Sign Up")}
                </Typography>
                <Box sx={{ mt: 1 }}>
                <PacmanLoader color={'#36D7B7'}loading={loading} cssOverride={override} size={70}/>
                <Tooltip title={nameError?"Please enter a valid name":""}>
                  <TextField
                      InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon/>
                        </InputAdornment>
                      )}}
                      margin="normal"
                      required
                      fullWidth
                      name="name"
                      type={"text"}
                      label={translateWord(newLocale,'Company Name')}
                      autoFocus
                      id="name"
                      value={name}
                      error={nameError}
                      onChange={handleNameChange}
                    />
                  </Tooltip>
                  <Tooltip title={phoneError?"Please Enter a valid Phone Number":""}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="phoneNumber"
                    label={translateWord(newLocale,"Company Phone Number")}
                    type="text"
                    id="phoneNumber"
                    InputProps={{
                      startAdornment:(<InputAdornment position='start'>
                        <PhoneIcon/>
                      </InputAdornment>)
                    }}
                    value={phoneNumber}
                    error={phoneError}
                    onChange={handlePhoneChange}
                  />
                  </Tooltip>
                  <Tooltip title={emailError?"Please Enter a valid email":""}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label={translateWord(newLocale,"Email")}
                    type="email"
                    id="email"
                    InputProps={{
                      startAdornment:(<InputAdornment position='start'>
                        <MailOutlineIcon/>
                      </InputAdornment>)
                    }}
                    value={email}
                    error={emailError}
                    onChange={handleEmailChange}
                  />
                  </Tooltip>
                  <Tooltip title={passwordError?"Please enter at least eight characters":""}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={translateWord(newLocale,"Password")}
                    type="password"
                    id="password"
                    InputProps={{
                      startAdornment:(<InputAdornment position='start'>
                        <LockIcon/>
                      </InputAdornment>)
                    }}
                    value={passwordValue}
                    error={passwordError}
                    onChange={handlePasswordChange}
                  />
                  </Tooltip>
                  <Tooltip title={numberOfBusesError?"Please enter a valid number of buses":""}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="buses"
                    label={translateWord(newLocale,"Number of Buses")}
                    type="number"
                    id="buses"
                    InputProps={{
                      startAdornment:(<InputAdornment position='start'>
                        <DirectionsBusIcon/>
                      </InputAdornment>),
                      inputProps:{
                        min:1
                      }
                    }}
                    value={numberOfBuses}
                    error={numberOfBusesError}
                    onChange={handleBusNumberChange}
                  />
                  </Tooltip>
                  <Tooltip title={logoNameError?"Please upload logo":""}>
                  <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"522px",height:"70px",background: "rgba(240, 240, 240, 1)",boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",px:"12px",border:logoNameError?"solid 1px #D32F2F":"solid 1px rgba(240, 240, 240, 1)",borderRadius:"5px",my:"1rem"}}>
                    <Typography sx={{fontFamily:"Open Sans",color: "rgba(204, 204, 204, 1)"}}>{logoName===null?translateWord(newLocale,"Enter Logo"):logoName["name"]}</Typography>
                    <Button variant="outlined" component={"label"} id={"logoFile"}>{translateWord(newLocale,"Upload")} <input type={"file"} hidden onChange={(e)=>handleUploadFile(e,"LogoFile")} name="LogoFile" accept="image/*"/></Button>
                  </Box>
                  </Tooltip>
                  <Tooltip title={licenseNameError?"Please Upload license":""}>
                  <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"522px",height:"70px",background: "rgba(240, 240, 240, 1)",boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",px:"12px",border:licenseNameError?"solid 1px #D32F2F":"solid 1px rgba(240, 240, 240, 1)",borderRadius:"5px",my:"2rem"}}>
                    <Typography sx={{fontFamily:"Open Sans",color: "rgba(204, 204, 204, 1)"}}>{licenseName===null?translateWord(newLocale,"Enter License"):licenseName["name"]}</Typography>
                    <Button variant="outlined" component={"label"} id={"licenseFile"}>{translateWord(newLocale,"Upload")} <input type={"file"} hidden onChange={(e)=>handleUploadFile(e,"LicenseFile")} name="LicenseFile" accept='application/pdf,image/*,application/msword'/></Button>
                  </Box>
                  </Tooltip>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2,color:"white",textTransform:"none",fontWeight:700,fontSize:"20px" }}
                  >
                    {translateWord(newLocale,"Sign Up")}
                  </Button>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
          </ThemeProvider>
      );
}
  export const getServerSideProps = (ctx)=>{
    const {locale,req,res} = ctx
    const token = req["cookies"]['token']
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    if(token){
      const tokenDecoded = jwt.verify(token,process.env.JWT_KEY)
      if(tokenDecoded.role!="BUS COMPANY"&&tokenDecoded.role!="TRIP MANAGER"){
          return {
            props:{locale:nextLocale||locale}
          }
      }
      return {
        redirect:{
          destination:'/home',
          permanent:false
        }
      };
    }
    return {
      props:{locale:nextLocale||locale}
    }
  }

export default SignUp;