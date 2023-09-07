import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function DataTable({activityLogs}) {
  return (
    <TableContainer component={Paper} sx={{mt:"1rem"}}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{display:"grid",gridTemplateColumns:"33.33% 33.33% 33.33%"}}>
              <TableCell align='center'>User</TableCell>
              <TableCell align='center'>Action</TableCell>
              <TableCell align='center'>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activityLogs.map((activity) => (
            <TableRow
              key={activity.time}
              sx={{display:"grid",gridTemplateColumns:"33.33% 33.33% 33.33%",'&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row" align='center'>
                    {activity.name}
                </TableCell>
                <TableCell align='center'>{activity.activity}</TableCell>
                <TableCell align='center'>{new Date(parseInt(activity.time)).toDateString()+" "+new Date(parseInt(activity.time)).toLocaleTimeString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
