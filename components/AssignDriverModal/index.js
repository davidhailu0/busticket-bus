import {useEffect, useState } from 'react';
import { Box, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import {gql,useMutation} from "@apollo/client"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useRouter } from 'next/router';
import ContainedButton from '../Button/customContainedButton';
import SelectComponent from '../SelectBox';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const MUTATEUPDATEBUS = gql`
mutation updateBus($busID:ID!,$BusInfo:updateBusInput!,$activity:CreateActivityLog){
    updateBus(busID:$busID,BusInfo:$BusInfo,activity:$activity){
                plateNumber
                busBrand
                busModel
                manufacturedYear
                VIN
                driver{
                    name
                }
                features
                numberOfSeats
    }
}`


export default function DriverAssignModal({open,setOpen,bus,allDrivers}) {
  const [driver,setDriver] = useState(null)
  const [driverError,setDriverError] = useState(false)
  const [buttonText,setButtonText] = useState("Assign")
  const [updateBus] = useMutation(MUTATEUPDATEBUS)
  const router = useRouter()
  const {locale,token} = useLocale()

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    if(bus===null||bus["driver"]==="Unassigned"){
      setDriver("")
    }
    else{
      setDriver(bus["driver"])
    }
    if(bus&&bus["driver"]==="Unassigned"){
      return setButtonText("Assign")
    }
    else if(bus&&bus["driver"]!=="Unassigned"&&!driverError){
      return setButtonText("Edit")
    }
  },[bus])

  useEffect(()=>{
      setDriverError(false)
      if(bus&&bus["driver"]==="Unassigned"){
        setButtonText("Assign")
      }
      else{
        setButtonText("Edit")
      }
  },[driver])

  const updateBusOnClick = async()=>{
    if(!driver){
      setDriverError(true)
      return
    }
    updateBusFunction()
    setOpen(false)
  }

  const updateBusFunction = async()=>{
    await updateBus({variables:{
      busID:bus["_id"],
      BusInfo:{
          driver:driver["_id"]
      },
      activity:{
        companyId:token._id,
        name:token.accountName,
      }
  }})
    router.reload()
    setOpen(false)
  }

  const filterDrivers = ()=>{
    const filteredArray =  allDrivers.filter((obj)=>{
      return (bus!==null&&bus["driver"]["_id"]===obj["_id"])||(!obj["assignedTo"])
    })
    return filteredArray
  }

  return (
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <DialogContent sx={{width:{md:"630px",xs:"300px"},height:"430px"}}>
            <Box sx={{mx:{md:"2rem",xs:0},display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100%"}}>
              <div>
                <Typography sx={{fontWeight:700,fontSize:"24px",color:"#CCCCCC",my:"0.5rem"}}>{translateWord(locale,"Assign Driver")}</Typography>
                <Typography mt={"1rem"} mb={"2rem"}>{translateWord(locale,"Bus")} - {bus&&bus.plateNumber}</Typography>
              </div>
              <Box sx={{mb:"2rem",height:"60%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div>
                  <Typography fontWeight={600} color={"#CCCCCC"}>{translateWord(locale,"Driver")} </Typography>
                  <SelectComponent label={"driver"} value={driver} setValue={setDriver} options={filterDrivers()} error={driverError&&!driver} setError={setDriverError}/>
                </div>
                <Box sx={{display:"flex",height:"70px",width:"100%",justifyContent:"flex-end"}}>
                    {driver&&<ContainedButton fontSize='20px' height='60px' width='200px' mr={0}  onClick={updateBusOnClick}>
                        {translateWord(locale,buttonText)}
                    </ContainedButton>}
                </Box>
              </Box>
            </Box>
        </DialogContent>
      </BootstrapDialog>
  );
}