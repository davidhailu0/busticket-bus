import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckedIcon from '../../Assets/Icons/CheckBoxIcon'
import { ToastContainer,toast } from 'react-toastify';
import { useNumberOfBusContext } from '../../utils/numberOfBusesContext';

const CustomCheckBox = ({value,label,departure,destination,subRoutes})=>{
    const {numberOfBuses,setSelectedDestinations,selectedRoute,selectedCheckBox,setSelectedCheckBox,setNewSelectedRoute} = useNumberOfBusContext()
    const changeValue = (e)=>{
        if(numberOfBuses===selectedCheckBox.length){
            toast.info("You can not more routes than the number of buses registered")
            return
        }
        setSelectedCheckBox(prev=>{
                if(e.target.checked){
                    setSelectedDestinations((prev)=>{ 
                        if(!prev[selectedRoute]){
                            prev[selectedRoute] = [{_id:label,subRoutes,departure,destination}]
                        }
                        else{
                            prev[selectedRoute] = [...prev[selectedRoute],{_id:label,subRoutes,departure,destination}]
                        }
                        return prev
                    })
                    setNewSelectedRoute([...prev,label])
                    return [...prev,label]
                }
                setSelectedDestinations(prev=>{
                    let newSelectedRouteArray;
                    let key;
                    for(let ky of Object.keys(prev)){
                        const foundDest = prev[ky].find(({_id})=>_id===label)
                        if(foundDest){
                            newSelectedRouteArray = prev[ky].filter(({_id})=>_id!==label)
                            prev[ky] = newSelectedRouteArray
                            key = ky
                            break
                        }
                    }
                    if(prev[key].length===0){
                        delete prev[key]
                    }
                    return prev
                })
                return prev.filter(val=>val!==label)
            })
    }
    return(<>
        <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"/>
        <Checkbox checked={value||selectedCheckBox.includes(label)} icon={<CheckBoxOutlineBlankIcon sx={{color:"#768463"}}/>} checkedIcon={<CheckedIcon/>} onChange={changeValue}/>
    </>)
}

export default CustomCheckBox;