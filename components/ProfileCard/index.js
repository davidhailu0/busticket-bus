import {Card,CardContent,Typography} from "@mui/material"

export default function ProfileCard({name,address,role}){
    return (<Card sx={{height:"12rem",display:"flex",justifyContent:"center",alignItems:"center",textAlign:'center',width:"23vw",mt:"1rem"}}>
        <CardContent>
            <Typography variant="h5">{name}</Typography>
            <Typography color="text.secondary">
          {address}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {role}
        </Typography>
        </CardContent>
    </Card>)
}