import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomDonutChart = ({deviceCount})=>{
  const data = {
    labels: ['Mobile', 'Laptop'],
    datasets: [
      {
        label: 'Devices Count',
        data: [deviceCount.mobile, deviceCount.desktop],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
   return (<Card sx={{ width: 300}}>
    <CardContent>
      <Doughnut data={data} />
    </CardContent>
  </Card>
  )
}

export default CustomDonutChart;
