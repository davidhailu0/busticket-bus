import { useState } from "react"
import {Card,CardContent,Typography,Divider,Box,Button} from "@mui/material"
import CustomTextField from "../CustomTextField"
import { patchRequest } from "../../utils/request-api"
import { useCookie } from "../../utils/cookies"

export default function ProfileInfo({_id,_name,_email,_phoneNumber,changeProfileInfo}){
    const [name,setName] = useState(_name)
    const [nameError,setNameError] = useState(false)
    const [email,setEmail] = useState(_email)
    const [emailError,setEmailError] = useState(false)
    const [phoneNumber,setPhoneNumber] = useState(_phoneNumber)
    const [phoneNumberError,setPhoneNumberError] = useState(false)
    const [getCookie] = useCookie()

    const updateProfile = async()=>{
        if(name!==""||phoneNumber!==""){
            const data = await patchRequest("/manage/updateProfile",{_id,name,email,phoneNumber},getCookie("token"))
            changeProfileInfo({name,phoneNumber})
        }
    }
    return (<Card sx={{mt:"1rem",width:"45vw"}}>
        <CardContent>
            <Typography variant="h6" sx={{fontWeight:"600"}}>Profile</Typography>
            <Typography color="text.secondary">The Information can be edited</Typography>
            <Divider sx={{mt:"1.5rem"}}/>
            <Box sx={{display:"flex",justifyContent:"space-between",mt:"1rem"}}>
                <CustomTextField value={name} setValue={setName} error={nameError} setError={setNameError} placeholder={"Name"}/>
                <CustomTextField value={email} setValue={setEmail} error={emailError} setError={setEmailError} placeholder={"Email"}/>
            </Box>
            <Box sx={{display:"flex",justifyContent:"space-between",mt:"1rem"}}>
                <CustomTextField value={phoneNumber} setValue={setPhoneNumber} error={phoneNumberError} setError={setPhoneNumberError} placeholder={"Phone Number"} type="number"/>
            </Box>
            <Divider sx={{my:"1.5rem"}}/>
            <Box sx={{display:"flex",justifyContent:"flex-end"}}>
            <Button variant="contained" sx={{textTransform:"none",background:"#10c9a7",":hover":{background:"#10c9a7"}}} onClick={updateProfile}>Update Profile</Button>
            </Box>
        </CardContent>
    </Card>)
}