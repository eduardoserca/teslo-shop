import { ShopLayout } from "@/components/layouts"
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { IProduct } from "@/interfaces";
import { Typography } from '@mui/material';
import useSWR from "swr";

const MenPage = () => {
  
  const { data, error } = useSWR<IProduct[]>('/api/products?gender=men'); 

  if( !data && !error) {
    return (<FullScreenLoading />);
  }



  return (
    <ShopLayout title='Teslo-Shop - Men' pageDescription='Ropa para hombres'>
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{mb:1}}>Ropa para hombres</Typography>
      
      <ProductList products={ data } />
      

    </ShopLayout>  
  )
}

export default MenPage
