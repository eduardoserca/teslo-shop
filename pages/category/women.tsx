import { ShopLayout } from "@/components/layouts"
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { IProduct } from "@/interfaces";
import { Typography } from '@mui/material';
import useSWR from "swr";


const WomenPage = () => {
  
  const { data, error } = useSWR<IProduct[]>('/api/products?gender=women'); 

  if( !data && !error) {
    return (<FullScreenLoading />);
  }


  return (
    <ShopLayout title='Teslo-Shop - Women' pageDescription='Ropa para mujeres'>
      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{mb:1}}>Ropa para mujeres</Typography>
            
      <ProductList products={ data } />

    </ShopLayout> 
  )
}

export default WomenPage
