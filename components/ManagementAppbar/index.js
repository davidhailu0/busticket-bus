import { useState,useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookie } from '../../utils/cookies';
import { useRouter } from 'next/router';
import { useLocale } from '../../utils/LanguageContext';
import Link from 'next/link';
import {languages,translateWord,changeLanguage} from '../../utils/languageTranslation';
import { Avatar } from '@mui/material';

const settings = ['Profile', 'Account', 'Dashboard', 'Signout'];

const customTheme = createTheme({
  palette:{
      primary:{
          main:"#fff",
      },
  }
}) 

const ManagementAppbar = ({setDrawerState,role}) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [privilege,setPrivilege] = useState(null)
  const [language,setLanguage] = useState(null)
  const [getCookie,setCookie,removeCookie,cookies] = useCookie()
  const router = useRouter()
  const {locale,token} = useLocale()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    setDrawerState(true)
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openLanguage = (event)=>{
    setLanguage(event.currentTarget)
  }

  const openPrivilege = (event)=>{
    setPrivilege(event.currentTarget)
  }

  const closeLanguage = ()=>{
    setLanguage(null)
  }

  const closePrivilege = ()=>{
    setPrivilege(null)
  }

  const changeSelectedLanguage = (locale)=>{
    changeLanguage(locale,setCookie)
    closeLanguage()
  }

  const logOut = async()=>{
    cookies.remove("token")
    await router.replace("/")
  }

  return (
    <ThemeProvider theme={customTheme}>
    <AppBar position='fixed' elevation={0} sx={{left:{md:"20vw",xs:"0"},width:{md:"80%",xs:"100%"},background:"#F5F5F5",zIndex:"90"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{width:"100%",textAlign:"end"}}>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 0,ml:"0.7rem",display:"flex" }}>
          <Tooltip title={"Account Setting"}>
            <Box sx={{display:"flex",alignItems:"center",mr:"2rem",cursor:"pointer",width:"180px",":hover":{background:"rgba(7,7,7,0.4)",borderRadius:"10px"},transition:"all 0.3s"}} onClick={openPrivilege}>
              <Avatar/>
              <Typography ml={"1rem"}>{role==="BUS COMPANY"?translateWord(locale,"Admin"):translateWord(locale,role.split(" ").map(str=>str[0]+str.substring(1).toLowerCase()).join(" "))}</Typography>
            </Box>
          </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={privilege}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(privilege)}
              onClose={closePrivilege}
            >
              {token.role!=='BUS COMPANY'&&<MenuItem onClick={closePrivilege}>
                  <Link href={token.employeeId?`/employees/${token.employeeId}`:'/account'}><Typography textAlign="center">{translateWord(locale,"Edit Profile")}</Typography></Link>
              </MenuItem>}
              <MenuItem onClick={logOut}>
                <Typography>{translateWord(locale,"Log Out")}</Typography>
              </MenuItem>
            </Menu>
            <Tooltip title={translateWord(locale,"Change Language")}>
              <IconButton onClick={openLanguage} sx={{ p: 0 }}>
                <LanguageIcon sx={{color:"#629460"}}/>
              </IconButton>
            </Tooltip>
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
              {languages.map((lang) => {
                if(getCookie("NEXT_LOCALE")!==lang.locale&&locale!==lang.locale)
                return (
                <MenuItem key={lang.lang} onClick={()=>changeSelectedLanguage(lang.locale)}>
                  <Link href={router.asPath} locale={lang.locale}><Typography textAlign="center">{lang.lang}</Typography></Link>
                </MenuItem>
              )
              }
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </ThemeProvider>
  );
};
export default ManagementAppbar;
