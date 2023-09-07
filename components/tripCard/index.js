import {Grid} from "@mui/material"
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const TripCard = ({departure,destination,departureTime,price,pickupLocations,shadow})=>{
    return (<Grid container sx={{boxShadow:shadow?"0px 0px 10px 0px #00000026":"none",background:shadow?"white":"trasparent",height:"80px"}}>
        <Grid item md={2} sx={{display:"flex",alignItems:"center",pl:7}}>
            <FmdGoodIcon/>
            <span style={{marginLeft:"0.5rem"}}>{departure}</span>
        </Grid>
        <Grid item md={2} sx={{display:"flex",alignItems:"center",pl:11}}>
            <FmdGoodIcon/>
            <span style={{marginLeft:"0.5rem"}}>{destination}</span>
        </Grid>
        <Grid item md={3} sx={{display:"flex",alignItems:"center",pl:20}}>
            {departureTime}
        </Grid>
        <Grid item md={2} sx={{display:"flex",alignItems:"center",pl:13.7}}>
            {price+" ETB"}
        </Grid>
        <Grid item md={3} sx={{display:"flex",alignItems:"center",pl:20}}>
            {pickupLocations}
        </Grid>
    </Grid>)
}

export default TripCard