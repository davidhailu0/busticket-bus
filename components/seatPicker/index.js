import { useEffect, useState } from 'react';
import { Box,Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import GreySeat from "../../Assets/images/greySeat.svg"
import GreenSeat from "../../Assets/images/greenSeat.svg"
import Seat from "../../components/seat"
import ContainedButton from '../Button/customContainedButton';
import { useUnavailableContext } from '../../utils/UnavailableSeatContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2}} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CustomizedDialogs({value,setValue}) {
  const [open,setOpen] = useState(false)
  const {numberOfUnavailbleSeats,unavailableSeats,setNumberOfUnavailableSeatsError} = useUnavailableContext()

  useEffect(()=>{
    if(numberOfUnavailbleSeats.length===unavailableSeats){
      setNumberOfUnavailableSeatsError(false)
    }
    else{
      setNumberOfUnavailableSeatsError(true)
    }
  },[numberOfUnavailbleSeats,unavailableSeats])

  const openSnackBar = ()=>{
    setOpen(true)
  }

  const handleClose = () => {
    setValue(false);
  };

  const closeSnackBar = ()=>{
    setOpen(false)
  }

  return (
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={value}
        maxWidth="md"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Select the Unavailble Seats
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{width:{md:"820px",xs:"350px"}}}>
          <Grid container>
            <Grid item md={5} sx={{position:"relative"}}>
              <Box sx={{position:"fixed",display:{md:"flex",xs:"none"},flexDirection:"column",justifyContent:"space-between"}}>
              <div style={{position:"fixed",height:"25rem",top:"24rem",width:"18%"}}>
                <Typography>Symbols</Typography>
                <Box sx={{display:"flex",alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreenSeat} height={"45px"} width={"45px"}/>
                  <Typography ml={"2rem"}>Available Seat</Typography>
                </Box>
                <Box sx={{display:"flex",alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreySeat} height={"45px"} width={"45px"}/>
                  <Typography ml={"2rem"}>Unavailable Seat</Typography>
                </Box>
              </div>
              </Box>
            </Grid>
            <Grid item md={7}>
              <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <Typography sx={{display:{md:"none",xs:"flex"}}}>Symbols</Typography>
                <Box sx={{display:{md:"none",xs:"flex"},alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreenSeat} height={"30px"} width={"30px"}/>
                  <Typography ml={"2rem"} fontSize={"14px"}>Available Seat</Typography>
                </Box>
                <Box sx={{display:{md:"none",xs:"flex"},alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreySeat} height={"30px"} width={"30px"}/>
                  <Typography ml={"2rem"} fontSize={"14px"}>Unavailable Seat</Typography>
                </Box>
              <SeatGrouper>
                  <Box sx={{display:{md:"none",xs:"block"},height:"30px",width:"67px"}}></Box>
                  <Box sx={{display:{md:"none",xs:"block"},height:"60px",width:"67px"}}></Box>
                  <Seat seatNumber={"3"} openSnackBar={openSnackBar}/>
                  <Seat seatNumber={"4"} openSnackBar={openSnackBar}/>
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"1"}openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"2"} penSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"7"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"8"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"5"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"6"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"12"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"11"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"9"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"10"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"16"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"15"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"13"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"14"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"20"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"19"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"17"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"18"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"24"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"23"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"21"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"22"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"28"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"27"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"25"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"26"} openSnackBar={openSnackBar}/> 
                    <Box sx={{display:{md:"none",xs:"block"},height:"30px",width:"67px"}}></Box>
                    <Box sx={{display:{md:"none",xs:"block"},height:"60px",width:"67px"}}></Box>
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"29"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"30"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"32"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"31"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"33"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"34"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"36"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"35"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"37"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"38"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"40"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"39"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"41"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"42"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"44"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"43"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"45"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"46"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"49"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"48"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"47"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
            </Box>
            </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{display:"flex",justifyContent:"flex-end"}}>
         <ContainedButton onClick={handleClose}>
            Confirm
          </ContainedButton>
        </DialogActions>
        <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"center"}} open={open} onClose={closeSnackBar} message={`Please Select only ${unavailableSeats} Seat(s)`}/>
      </BootstrapDialog>
  );
}

const SeatGrouper = ({children})=>{
  return (
  <Box sx={{display:"flex",justifyContent:'space-between'}}>
    <Box sx={{display:"flex"}}>
        {children[0]}
        {children[1]}
    </Box>
  <Box sx={{ml:{md:children.length===5?0:"5rem",xs:children.length===5?0:"3rem"}}}>
      <Box sx={{display:"flex"}}>
      {children[2]}
      {children[3]}
      {children[4]}
      </Box>
  </Box>
</Box>)
}