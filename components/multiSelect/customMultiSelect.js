import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { translateWord } from '../../utils/languageTranslation';
import { useLocale } from '../../utils/LanguageContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CustomMultiSelectCheckBox({selectedFeatures,setFeatures,features,disabled,error,setError,label}) {
  const {locale}= useLocale()
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFeatures(
      typeof value === 'string' ? value.split(',') : value,
    );
    if(setError){
      setError(false)
    }
  };

  return (<Select
          multiple
          id="MultiSelectOption"
          name={label}
          value={selectedFeatures}
          onChange={handleChange}
          renderValue={(selected) => {
            const newSelected = selected.map(feat=>translateWord(locale,feat))
            return newSelected.join(', ')}}
          MenuProps={MenuProps}
          disabled={disabled}
          error={error}
          sx={{width:{md:"522px",xs:"320px"},boxShadow: "0px 0px 10px 0px #00000026",mt:"0.5rem",background:"#fff"}}
        >
          {features.map((featr) => (
            <MenuItem key={featr} value={featr}>
                <Checkbox checked={selectedFeatures.indexOf(featr) > -1} />
                <ListItemText primary={translateWord(locale,featr)} />
            </MenuItem>
          ))}
        </Select>
  );
}