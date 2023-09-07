import { DatePicker} from 'antd';
import {translateWord} from '../../utils/languageTranslation';
import { useLocale } from '../../utils/LanguageContext';
const { RangePicker } = DatePicker;

export default function DateRangePicker({handleChange,error}){
    const {locale} = useLocale()

    const disabledDate = (currentDate)=>{
        const tomorrowDate = new Date()
        tomorrowDate.setDate(tomorrowDate.getDate()+1)
        return tomorrowDate.getTime()-currentDate.valueOf()>86400000
    }
    return (<RangePicker showToday={false} testbutton={"range_picker"} placeholder={[translateWord(locale,"From"),translateWord(locale,"Upto")]} disabledDate={(currentDate)=>disabledDate(currentDate)} style={{width:"96%",height:"3.5rem",color:"grey",borderRadius:"5px",marginLeft:"7px",background:"#f5f5f5",borderColor:error?"red":"#b5b5b5"}} className="rangePicker_class" onChange={handleChange}/>);
}