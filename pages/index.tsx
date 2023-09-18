import type { NextPage } from 'next';

import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const Home: NextPage = () => {


  const {products, isLoading} = useProducts('/products');

  return (
    <ShopLayout title='Teslo-Shop' pageDescription='Encuentra los mejores productos de Tesla aquí'>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{mb:1}}>Todos los productos</Typography>
      
      {
        isLoading 
          ? <FullScreenLoading />
          : <ProductList products={ products } />
      }

      


    </ShopLayout>  
  )
}


export default Home;
