import { useState } from 'react';
import { Box } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';

export default function EmployeeCard({name,role,phoneNumber,busPlate,id,openModal}) {
  const [openNav,setOpenNav] = useState(null)
  const router = useRouter()
  const {locale} = useLocale()

  const onViewButtonClick = ()=>{
    sessionStorage.setItem("employeeName",name)
    sessionStorage.setItem("employeePhone",JSON.stringify(phoneNumber))
    sessionStorage.setItem("employeeRole",role)
    sessionStorage.setItem("employeeBusPlate",busPlate)
    sessionStorage.setItem("employeeId",id)
    closeNavOnClick()
    openModal()
  }

  const onEditButtonClick = ()=>{
    closeNavOnClick()
    router.push("employees/"+id)
  }

  const openNavOnClick = (event)=>{
    setOpenNav(event.currentTarget)
  }

  const closeNavOnClick = ()=>{
    setOpenNav(null)
  }

  return (<Box sx={{ width: "217px",height:"180px"}}>
    <Avatar sx={{position:"relative",top:"1rem",left:"1rem",fontSize:"30px"}}/>
    <Box sx={{ width: "217px",height:"150px",pb:"1rem",background:"#fff"}}>
      <CardHeader 
        action={
          <IconButton onClick={openNavOnClick}>
            <MoreVertIcon />
          </IconButton>
        }
      />
        <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={openNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(openNav)}
              onClose={closeNavOnClick}
            >
                <MenuItem onClick={onViewButtonClick}>
                  <Typography textAlign="center">{translateWord(locale,"View Profile")}</Typography>
                </MenuItem>
                <MenuItem onClick={onEditButtonClick}>
                  <Typography textAlign="center">{translateWord(locale,"Edit Profile")}</Typography>
                </MenuItem>
            </Menu>
        <Box sx={{px:3}}>
            <Typography sx={{fontWeight:600}}>{name}</Typography>
            <Typography mt={3} color="text.secondary">{translateWord(locale,role)}</Typography>
        </Box>
    </Box>
    </Box>
  );
}