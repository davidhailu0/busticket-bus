import {Card,Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Image from 'next/image'

export default function DetailCard({label,amount,img}) {
  return (
    <Card sx={{ width: 250,height:200,display:"flex",flexDirection:"column",justifyContent:"space-between",p:"1rem",my:{md:0,xs:"0.5rem"}}}>
        <Box sx={{alignSelf:"end"}}>
          <Image src={img.src} width={50} height={50}/>
        </Box>
        <Typography variant="h4" component="div">
          {amount}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {label}
        </Typography>
    </Card>
  );
}
