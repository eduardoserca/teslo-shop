import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
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


/** No usar SSR
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
}*/


// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const productSlugs = await  dbProducts.getAllProductSlug();

  return {

    paths: productSlugs.map(({slug}) =>({
      params:{
        slug
      }
    })),
    
    fallback: "blocking"
  }
}


// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({params}) => {

  const {slug = ''} = params as {slug: string};
  const product = await dbProducts.getProductBySlug(slug);

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
    }, 
    revalidate: 60*60*24
  }
}



export default ProductPage;
