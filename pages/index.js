import { useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Tooltip,InputAdornment,IconButton} from '@mui/material'
import Image from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import Link from "next/link"
import jwt from "jsonwebtoken"
import LanguageIcon from '@mui/icons-material/Language';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { PacmanLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import { useMutation,gql } from '@apollo/client';
import oliveLogo from "../Assets/images/oliveLogo.png"
import {useCookie} from "../utils/cookies"
import {validateEmail,validatePhone} from "../utils/validate"
import { translateWord,languages,changeLanguage } from '../utils/languageTranslation';
import { getClientIpLocation } from '../utils/request-api';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ForgotPasswordModal from '../components/forgotPassword';
import {LocaleLanguage} from "../utils/LanguageContext"

const MUTATELOGIN = gql`
    mutation loginBusCompany($input:loginInfoInput!){
      loginBusCompany(loginInfo:$input){
        _id
        name
        phoneNumber
        email
        password
        active
        logo
        license
        numberOfBuses
        token
      }
    }
`

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link href="/">
          My Bus
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

const LogIn = ({locale})=>{
    const [loading,setLoading] = useState(false);
    const [credentialValue,setCredential] = useState("")
    const [credentialError,setCredentialError] = useState(false)
    const [passwordValue,setPasswordValue] = useState("")
    const [passwordError,setPasswordError] = useState(false)
    const [getCookie,setCookie] = useCookie()
    const [loginBus] = useMutation(MUTATELOGIN)
    const [newLocale,setNewLocale] = useState(locale)
    const [language,setLanguage] = useState(null)
    const [openForgotPassword,setOpenForgotPassword] = useState(false)
    const router = useRouter()

    useEffect(()=>{
      async function fetchLanguage(){
        const languageData = await getClientIpLocation()
        if(languageData){
          setCookie("NEXT_LOCALE", languageData['lang'])
          setNewLocale(languageData['lang'])
        }
      }
      if(!getCookie("NEXT_LOCALE")){
        fetchLanguage()
      }
    },[])

  const openLanguage = (event)=>{
      setLanguage(event.currentTarget)
  }
  
  const closeLanguage = ()=>{
      setLanguage(null)
  }

  const changeSelectedLanguage = (locale)=>{
      changeLanguage(locale,setCookie)
      router.replace("/","/")
      setNewLocale(locale)
      closeLanguage()
  }

  const openForgotPasswordClk = ()=>{
    setOpenForgotPassword(true)
  }

  const handleCloseForgotPassword = ()=>{
    setOpenForgotPassword(false)
  }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(validateInput()){
            setLoading(true)
            let resp;
            try{
              resp = await loginBus({variables:{input:{email:credentialValue,password:passwordValue}}})
            }
            catch(e){
              setLoading(false)
            }
            setLoading(false)
            if(resp&&resp["data"]["loginBusCompany"]["token"]){
              setCookie("token",resp["data"]["loginBusCompany"]["token"])
              setCookie('busid',resp["data"]["loginBusCompany"]["_id"])
              router.replace("home")
            }
            else{
              toast.error(translateWord(locale,"Invalid Credential or Password"))
            }
        }
    }

    const goToSignUp = ()=>{
      router.push("signUp")
    }

    const changeValue = (value,setValue,setError)=>{
        setValue(value)
        if(value===""){
            setError(true)
            return
        }
        setError(false)
    }

    const validateInput = ()=>{
      if(credentialValue===""||(!validateEmail(credentialValue)&&!validatePhone(credentialValue))){
        setCredentialError(true)
        return false
      }
      else if(passwordValue===""){
        setPasswordError(true)
        return false
      }
      return true
    }

    return (<ThemeProvider theme={customTheme}>
      <LocaleLanguage.Provider value={{locale}}>
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
          <Grid container component="main" sx={{ height: '100vh',fontFamily:"Open Sans" }}>
            <CssBaseline />
            <Box sx={{position:"absolute",top:"25px",right:{md:"35px",xs:4},zIndex:5}}>
                    <IconButton onClick={openLanguage}>
                      <LanguageIcon sx={{color:'#fff'}}/>
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
            <Grid item xs={12} sm={8} md={5}>
              <Box sx={{ml:{md:10,xs:4},mr:{md:0,xs:4},pt:"30px"}}>
                  <Image src={oliveLogo.src} width={63} height={50}/>
              </Box>
              <Box
                sx={{
                  mt: 12,
                  ml: {md:10,xs:4},
                  mr:{md:0,xs:4},
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent:"center",
                  alignItems: 'center',
                }}
                component='form'
                noValidate
                onSubmit={handleSubmit}
              >
                <Typography sx={{alignSelf:"flex-start",fontWeight:"700",fontSize:"32px",lineHeight:"43.58px"}}>
                  {translateWord(newLocale,"Sign In")}
                </Typography>
                <Box sx={{ mt: 1 }}>
                <PacmanLoader color={'#36D7B7'}loading={loading} cssOverride={override} size={70}/>
                <Tooltip title={credentialError?"You Entered Invalid Credential":""}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon/>
                      </InputAdornment>
                    )}}
                    margin="normal"
                    required
                    fullWidth
                    label={translateWord(newLocale,"Email or Phone Number")}
                    name="credential"
                    type={"text"}
                    autoFocus
                    id={"credential"}
                    value={credentialValue}
                    error={credentialError}
                    onChange={(e)=>{
                      changeValue(e.target.value,setCredential,setCredentialError)
                    }}
                  />
                  </Tooltip>
                  <Tooltip title={passwordError?"Please Enter Password":""}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={translateWord(newLocale,"Password")}
                    type="password"
                    id={"password"}
                    InputProps={{
                      startAdornment:(<InputAdornment position='start'>
                        <LockIcon/>
                      </InputAdornment>)
                    }}
                    inputProps={{
                        autoComplete:"new-password",
                        form:{
                            autoComplete:'off'
                        }
                      }}
                    value={passwordValue}
                    error={passwordError}
                    onChange={(e)=>{
                      changeValue(e.target.value,setPasswordValue,setPasswordError)
                    }}
                  />
                  </Tooltip>
                  <Box sx={{width:"100%",display:"flex",justifyContent:"flex-end"}}>
                    <Button className='Link' sx={{textTransform:'none',fontWeight:400}} onClick={openForgotPasswordClk}>
                          {translateWord(newLocale,"Forgot Password?")}
                    </Button>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2,color:"white",textTransform:"none",fontSize:"20px",fontWeight:700 }}
                  >
                    {translateWord(newLocale,"Sign In")}
                  </Button>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                background:`#629460`,
                transform:"skewX(12deg) translateX(13rem)",
                display:{md:"flex",xs:"none"},
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center"
              }}>
                <Box sx={{transform:"skewX(-12deg) translateX(-5rem)",width:"100%",display:"flex",flexDirection:"column",justifyContent:'center',alignItems:"center",px:"7rem"}}>
                  <Typography sx={{color:"#fff",fontWeight:"600",fontSize:"24px",lineHeight:"27.24px"}}>{translateWord(newLocale,"Don't have an account yet ?")}</Typography>
                  <ThemeProvider theme={customThemeBTN}>
                    <Button variant='outlined' sx={{mt:"4rem",color:"#fff",textTransform:"none"}} onClick={goToSignUp}>{translateWord(newLocale,"Sign Up")}</Button>
                  </ThemeProvider>
                </Box>
              </Grid>
          </Grid>
          <ForgotPasswordModal open={openForgotPassword} handleClose={handleCloseForgotPassword}/>
          </LocaleLanguage.Provider>
        </ThemeProvider>
      );
}
export const getServerSideProps = (ctx)=>{
  const {locale,req,res} = ctx
  const token = req["cookies"]['token']
  const nextLocale = req["cookies"]['NEXT_LOCALE']
  if(token){
    const tokenDecoded = jwt.verify(token,process.env.JWT_KEY)
    if(tokenDecoded.role==="BUS COMPANY"||tokenDecoded.role==="TRIP MANAGER"){
        return {
          redirect:{
            destination:'/home',
            permanent: false
          }
        };
    }
  }
  return {
    props:{
      locale:nextLocale||locale
    }
  }
}

export default LogIn;
