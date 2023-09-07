import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckedIcon from '../../Assets/Icons/CheckBoxIcon'

const CustomCheckBox = ({value,changeStatus,label})=>{
    const changeValue = (e)=>{
        if(label){
            changeStatus(prev=>{
                if(e.target.checked){
                    if(label.length){
                        return [...prev,...label]
                    }
                    return [...prev,label]
                }
                if(label.length){
                    let newPrev = prev.map(obj=>obj)
                    for(let el of label){
                        newPrev = newPrev.filter(val=>val!==el)
                    }
                    return newPrev
                }
                return prev.filter(val=>val!==label)
            })
        }
        else{
            changeStatus(e.target.checked)
        }
    }
    return(<Checkbox checked={value} icon={<CheckBoxOutlineBlankIcon sx={{color:"#768463"}}/>} checkedIcon={<CheckedIcon/>} onChange={changeValue}/>)
}

export default CustomCheckBox;