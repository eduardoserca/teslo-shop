import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { ShopLayout } from '@/components/layouts';
import { ProductSlideshow, SizeSelector } from '@/components/products';


import { ItemCounter } from '@/components/ui';
import { Grid, Box, Typography, Button } from '@mui/material';


import { IProduct } from '@/interfaces';
import { dbProducts } from '@/database';




interface Props {
  product: IProduct;
}


const ProductPage:NextPage<Props> = ({product}) => {



  return (
    <ShopLayout 
        title={product.title}
        pageDescription={product.description}>

          <Grid container spacing={3}>          

            <Grid item xs={12} sm={7}>
              <ProductSlideshow 
              images={product.images} />

            </Grid>

            <Grid item xs={12} sm={5}>
              <Box display='flex' flexDirection='column'>

                {/** títulos */}
                <Typography variant='h1' component='h1'>{product.title}</Typography>
                <Typography variant='subtitle1' component='h2'>{`$${product.price}`}</Typography>

                {/** cantidad */}
                <Box sx={{ my:2} }>
                  <Typography variant='subtitle2'>Cantidad</Typography>
                  <ItemCounter />
                  <SizeSelector 
                    //selectedSize={product.sizes[0]} 
                    sizes={product.sizes} />
                </Box>

                {/** Agregar al carrito */}
                <Button color='secondary' className='circular-btn'>
                  Agregar al carrito
                </Button>

                {/** <Chip label="No hay disponibles" color= "error" variant='outlined'/> */}

                {/** description */}
                <Box sx={{ mt:3}}>
                  <Typography variant='subtitle2'>Descripción</Typography>
                  <Typography variant='body2'>{product.description}</Typography>
                </Box>

              </Box>
            </Grid>

          </Grid>

    </ShopLayout>
  )
}



export const getServerSideProps: GetServerSideProps = async (ctx) => {
    
  const { slug } = ctx.query;
  const product = await dbProducts.getProductBySlug(slug as string);

  if( !product ){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
      props: {
          product
      }
  }
}





export default ProductPage;
