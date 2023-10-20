import NextLink from 'next/link';
import { AdminLayout } from "@/components/layouts"
import {  IProduct } from "@/interfaces";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material"
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from "swr";



const columns: GridColDef[] = [

    {
        field:'img', 
        headerName:'Foto',
        renderCell: ({row}:GridValueGetterParams) => {
            return (
                <a 
                    href={`/product/${row.slug}`} 
                    target="_blank" 
                    rel="noreferrer">
                    <CardMedia 
                        component='img'
                        alt={row.title}
                        className="fadeIn"
                        //image={ `/products/${row.img}`}
                        image={ row.img}
                    />

                </a>
            )
        }
    },
    {
        field:'title', 
        headerName:'Titulo', 
        width: 300 ,
        renderCell: ({row}:GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${ row.slug}`} passHref legacyBehavior>
                    <Link underline='always'>
                        { row.title}
                    </Link>
                </NextLink>
                
            )
        }
    },
    {field:'gender', headerName:'Género' },
    {field:'type', headerName:'Tipo' },
    {field:'inStock', headerName:'Inventario' },
    {field:'price', headerName:'Precio' },
    {field:'size', headerName:'Tallas',  width: 150  },        

]

const ProductsPage = () => {

    const {data, error} = useSWR<IProduct[]>('/api/admin/products');

    if( !data && !error) return (<>Cargando...</>);

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0].path.includes('cloudinary.com') ? product.images[0].path : `/products/${product.images[0].path}` ,
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        size: product.sizes.join(', '),
        slug: product.slug,
    }));
    
    return(
        <AdminLayout 
            title={`Productos (${ data?.length})`} 
            subTitle={"Mantenimiento de productos"}
            icon={<CategoryOutlined/>}
        >

            <Box display='flex' justifyContent='end' sx={{ mb: 2}}>
                <Button
                    startIcon = { <AddOutlined /> }
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear producto
                </Button>

            </Box>

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

export default ProductsPage
