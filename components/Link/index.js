import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useLocale } from '../../utils/LanguageContext';

const LinkComponent = ({to,label,children})=>{
    const {locale} = useLocale()
    return (<Link href={to} local={locale}>
    <ListItem disablePadding>
                <ListItemButton sx={{":hover":{background:"#D6DAD0"},pl:5,transition:"all 0.5s"}}>
                <ListItemIcon>
                        {children}
                </ListItemIcon>
                    <ListItemText sx={{color:"#629460"}} primary={label} />
                </ListItemButton>
                </ListItem>
                </Link>
                )
}

export default LinkComponent;