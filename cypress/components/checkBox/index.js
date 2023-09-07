import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckedIcon from '../../Assets/Icons/CheckBoxIcon'

const CustomCheckBox = ({value,changeStatus})=>{
    const changeValue = (e)=>{
        changeStatus(e.target.checked)
    }
    return(<Checkbox checked={value} icon={<CheckBoxOutlineBlankIcon sx={{color:"#768463"}}/>} checkedIcon={<CheckedIcon/>} onChange={changeValue}/>)
}

export default CustomCheckBox;