import Typography from  '@mui/material/Typography';
import Image from "next/image"
import Box from '@mui/material/Box';
import builderLogo from '../../Assets/images/bus_logo.png';
import style from "../../styles/Footer.module.css"

const Footer = ()=>{
        return(<Box className={style.footer} sx={{display:{xs:'grid',md:'flex'},height:{xs:'500px',md:'300px'}}} justifyContent={'space-around'} alignItems={'center'} rowGap={'2rem'}>
            <div>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Image src={builderLogo} alt='builder-logo' height='100' width='100'/>
                </div>
                <p>&copy; 2022 All Rights Reserved Addis Ababa, Ethiopia</p>
            </div>
            <div>
                <Typography>My Bus For Bus Providers</Typography>
                <ul className={style.footer_list}>
                    <li>
            <Typography fontWeight={250} style={{cursor:'pointer'}}>How to Schedule Trip?</Typography>
          </li>
          <li>
            <Typography fontWeight={250} style={{cursor:'pointer'}}>How to modify trip?</Typography>
          </li>
                </ul>
            </div>
            <div>
                <Typography >Support</Typography>
                <ul className={style.footer_list}>
                <li>
            <Typography fontWeight={250} style={{cursor:'pointer'}}>Contact Us</Typography>
          </li>
                </ul>
            </div>
        </Box>)
}
export default Footer;