import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({columns,rows}) {
  return (
    <div style={{height:400 }}>
    <Card sx={{my:"1rem"}}>
     <CardContent sx={{height:400}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      </CardContent>
    </Card>
    </div>
  );
}
