import { AdminLayout } from "@/components/layouts"
import { IOrder, IUser } from "@/interfaces";
import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Chip, Grid } from "@mui/material";

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from "swr";



const columns: GridColDef[] = [
    {field:'id', headerName:'Order ID', width: 250 },
    {field:'email', headerName:'Correo', width: 250 },
    {field:'name', headerName:'Nombre completo', width: 300 },
    {field:'total', headerName:'Monto total', width:100, align:'center' },
    {
        field:'isPaid', 
        headerName:'Pagada', 
        renderCell: ({row}: GridValueGetterParams) => {
            return row.isPaid
                ? (<Chip variant="outlined" label="Pagada" color="success" />)
                : (<Chip variant="outlined" label="Pendiente" color="error" />)
        }
    },
    {field:'noProducts', headerName:'No. Productos', align:'center' , width:130 },
    {
        field:'check', 
        headerName:'Ver orden', 
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
                    Ver orden
                </a>
            )
        }
    },
    {field:'createdAt', headerName:'Creada en', width: 300 },

]

const OrdersPage = () => {

    const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

    if( !data && !error) return (<>Cargando...</>);

    const rows = data!.map( order => ({
        id: order._id,
        email: (order.user as IUser)?.email,
        name: (order.user as IUser)?.name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt
    }));
    
    return(
        <AdminLayout 
            title={"Ordenes"} 
            subTitle={"Mantenimiento de ordenes"}
            icon={<ConfirmationNumberOutlined/>}>



                <Grid container className='fadeIn'>
                    <Grid item xs={12} sx={{height:650, width:'100%'}}>
                        <DataGrid 
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[10, 20, 100]}
                        />

                    </Grid>

                </Grid>

        </AdminLayout>
    )
    
}

export default OrdersPage
