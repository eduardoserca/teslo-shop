import NextLink from "next/link";
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ShopLayout } from "@/components/layouts"

const columns: GridColDef[] = [
    {field:'id', headerName:'ID', width: 100 },
    {field:'fullname', headerName:'Nombre completo', width: 300 },    
    {
        field:'paid', 
        headerName:'Pagada', 
        description:'Muetra información si está pagada la orden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams ) => {
            return (
                params.row.paid 
                ? <Chip color='success' label='Pagada' variant='outlined' />
                : <Chip color='error' label='No pagada' variant='outlined' />
            )
        }
        
    },    
    {
        field:'orden', 
        headerName:'ver Orden',         
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams ) => {
            return (
                <NextLink href={`/orders/${params.row.paid}`} passHref legacyBehavior>
                    <Link underline="always">
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
        
    },
];

const rows = [
    { id: 1, paid:true, fullname: 'Carlos Serrano'},
    { id: 2, paid:false, fullname: 'Fernando Tang'},
    { id: 3, paid:true, fullname: 'Juan Fernandez'},
    { id: 4, paid:false, fullname: 'Gianppierre Ponce'},
    { id: 5, paid:true, fullname: 'Kenyi Condezo'},
    { id: 6, paid:false, fullname: 'Alex Pomazon'},
    { id: 7, paid:true, fullname: 'Richard Berrocal'},
    { id: 8, paid:false, fullname: 'Daniel Garay'},
    { id: 9, paid:true, fullname: 'Jimmy Cerna'},
    { id: 10, paid:true, fullname: 'Jose Perez'},
]

const HistoryPage = () => {
  return (
    <ShopLayout 
        title={"Historial de ordenes"} 
        pageDescription={"Historial de ordenes de los clientes"}>
        
        <Typography variant="h1" component="h1">Historial de ordenes</Typography>

        <Grid container >
            <Grid item xs={12} sx={{height:650, width:'100%'}}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 20, 100]}
                />

            </Grid>

        </Grid>

    </ShopLayout>
  )
}

export default HistoryPage
