import Card from '@mui/material/Card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { translateWord } from '../../utils/languageTranslation';
import { useLocale } from '../../utils/LanguageContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const CustomBarChart = ({previousYearData,currentYearData})=>{
  const {locale} = useLocale()
  const labels = [translateWord(locale,'January'), translateWord(locale,'February'), translateWord(locale,'March'), translateWord(locale,'April'), translateWord(locale,'May'), translateWord(locale,'June'), translateWord(locale,'July'),translateWord(locale,'August'),translateWord(locale,'September'),translateWord(locale,'October'),translateWord(locale,'November'),translateWord(locale,'December')];
  const data = {
    labels,
    datasets: [
      {
        label: new Date().getUTCFullYear()-1,
        data: previousYearData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: new Date().getUTCFullYear(),
        data: currentYearData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
    return (<Card sx={{ width: {md:"85%",xs:"85%"},height:{md:"auto"},my:"2rem",p:2,pb:3 }}>
                    <Bar options={{responsive:true,plugins:{legend: {position: 'top',},title: {
        display: true,
        text: translateWord(locale,'Number of Tickets Sold'),
      }}}} data={data}/>
            </Card>
            )
}

export default CustomBarChart;