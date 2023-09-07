import {useState,useEffect} from 'react';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { Tooltip,Avatar} from '@mui/material';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookie } from '../../utils/cookies';
import { useLocale } from '../../utils/LanguageContext';
import Link from 'next/link'
import {languages,translateWord,changeLanguage} from '../../utils/languageTranslation';
import { getClientIpLocation } from "../../utils/request-api"
import busLogo from "/Assets/images/bus_logo.png"


const customTheme = createTheme({
    palette:{
        primary:{
            main:"#fff",
        },
    }
}) 

const imageWidth = 80;
const imageHeight = 70;

const ResponsiveAppBar = ({}) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [language,setLanguage] = useState(null)
  const [privilege,setPrivilege] = useState(null)
  const router = useRouter()
  const [getCookie,setCookie,removeCookie,cookieValue] = useCookie()
  const {locale} = useLocale()

  useEffect(()=>{
    async function fetchLanguage(){
      const languageData = await getClientIpLocation()
      if(languageData){
        setCookie("NEXT_LOCALE",languageData['lang'])
      }
    }
    if(!getCookie("NEXT_LOCALE")){
      fetchLanguage()
    }
  },[getCookie,setCookie])

  useEffect(()=>{
    router.replace("/")
  },[cookieValue])

  const handleOpenUserMenu = (event) => {
    setLanguage(event.currentTarget);
  };

  const handleOpenPrivilege = (event)=>{
    setPrivilege(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setLanguage(null);
  };

  const handleClosePrivilege = ()=>{
    setPrivilege(null)
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = ()=>{
    setAnchorElNav(null);
  }

  const logOut = () => {
    setAnchorElNav(null);
    removeCookie("token")
  };

  const changeSelectedLanguage = (lang)=>{
    changeLanguage(lang,setCookie)
    handleCloseUserMenu()
  }

  return (
    <ThemeProvider theme={customTheme}>
    <AppBar position="static" sx={{background:"white",width:"100vw"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image src={busLogo} alt="My Bus Logo" height={imageHeight} width={imageWidth}/>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow:1
            }}
          >
            {translateWord(locale,"MY BUS")}
          </Typography>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Image src={busLogo} alt='My Bus Logo' height={imageHeight} width={imageWidth}/>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {translateWord(locale,"MY BUS")}
          </Typography>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem onClick={logOut}>
                  <Typography textAlign="center">{translateWord(locale,"Log Out")}</Typography>
                </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ mr:2, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={logOut}
                sx={{ my: 2, color: 'white', display: 'block',background:"#e52929",":hover":{background:"#e52929"} }}
                variant="contained"
              >
                {translateWord(locale,"Log Out")}
              </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
              <Box sx={{display:"flex"}} onClick={handleOpenPrivilege}>
                <Avatar/>
                <Typography>Admin</Typography>
              </Box>
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
              onClose={handleClosePrivilege}
            >
                <MenuItem key={locale} onClick={logOut}>
                  <Typography>Log Out</Typography>
                </MenuItem>
            </Menu>
            <Tooltip title={translateWord(locale,"Change Language")}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <LanguageIcon/>
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
              onClose={handleCloseUserMenu}
            >
              {languages.map(({lang,locale}) => {
                if(locale!==getCookie('NEXT_LOCALE'))
                return(
                <MenuItem key={locale} onClick={()=>changeSelectedLanguage(locale)}>
                  <Link locale={locale} href={router.pathname} as={router.asPath}><Typography textAlign="center">{lang}</Typography></Link>
                </MenuItem>
              )
            }
              )
            }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  );
};
export default ResponsiveAppBar;

