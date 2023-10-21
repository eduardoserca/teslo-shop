import { ShopLayout } from "@/components/layouts"
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { IProduct } from "@/interfaces";
import { Typography } from "@mui/material"
import useSWR from "swr";


const KidPage = () => {
  
  const { data, error } = useSWR<IProduct[]>('/api/products?gender=kid'); 

  if( !data && !error) {
    return (<FullScreenLoading />);
  }

  return (
    <ShopLayout title='Teslo-Shop - Kid' pageDescription='Ropa para niños'>
      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{mb:1}}>Ropa para niños</Typography>
      
      <ProductList products={ data } />

    </ShopLayout> 
  )
}

export default KidPage
