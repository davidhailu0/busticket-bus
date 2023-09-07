import { useState,useEffect } from "react"
import { Typography,Box } from "@mui/material"
import { useUnavailableContext } from "../../utils/UnavailableSeatContext";
import Image from "next/image";
import GreenSeat from "../../Assets/images/greenSeat.svg"
import GreySeat from "../../Assets/images/greySeat.svg"

const Seat = ({seatNumber,openSnackBar}) => {
  const [status,setStatus] = useState("green")
  const {numberOfUnavailbleSeats,setNumberOfUnavailableSeats,unavailableSeats} = useUnavailableContext()

  useEffect(()=>{
    checkStatus()
  },[numberOfUnavailbleSeats])

  const changeStatus = async()=>{
    if(numberOfUnavailbleSeats.length<unavailableSeats){
      setNumberOfUnavailableSeats(prev=>{
        let newPrev = [...prev]
        newPrev.push(parseInt(seatNumber))
        return newPrev
      })
    }
    else if(numberOfUnavailbleSeats.length>=unavailableSeats&&numberOfUnavailbleSeats.includes(parseInt(seatNumber))){
      setNumberOfUnavailableSeats(prev=>{
        let newPrev = [...prev]
        newPrev = newPrev.filter(num=>num!==parseInt(seatNumber))
        return newPrev
      })
    }
    else{
      openSnackBar()
    }
  }

  const checkStatus = ()=>{
    if(numberOfUnavailbleSeats.includes(parseInt(seatNumber))){
        setStatus("grey")
    }
    else{
        setStatus("green")
    }
  }

  const seatColorChoice = ()=>{
    if(status==="green"){
      return GreenSeat
    }
    else if(status==="yellow"){
      return YellowSeat
    }
    return GreySeat;
  }

  return(<Box style={{height:{md:"60px",xs:"30px"},width:{md:"60px",xs:"30px"},display:"flex",justifyContent:"center",alignItems:"center",margin:"1rem",position:"relative",cursor:"pointer"}} onClick={changeStatus}>
      <Image src={seatColorChoice()} height={"60px"} width={"60px"}/>
      <Typography fontWeight={"bold"} color="white" sx={{position:"absolute",top:{md:"0.5rem",xs:0},fontSize:{md:"16px",xs:"14px"},cursor:"pointer"}}>{seatNumber}</Typography>
  </Box>)
}

export default Seat
