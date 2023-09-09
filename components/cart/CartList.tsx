import { FC, useContext } from 'react';
import NextLink from "next/link";

import { Typography, Grid, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material';


import { CartContext } from '@/context';
import { ItemCounter } from '../ui';
import { ICartProduct, ISize } from '@/interfaces';



interface Props {
    editable?: boolean;

}

export const CartList:FC<Props> = ({ editable = false}) => {
    
    const { cart, updateCartQuantity, removeCartProduct } = useContext( CartContext );

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product);
    }

   


    return (
        <>
            {
                cart.map(product => (

                    <Grid container spacing={2} key={product.slug + product.size} columns={{ xs: 1,  md: 12 }}>

                        <Grid item xs={3}>
                            {/** TODO: llevar a la página del producto */}
                            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia 
                                            image={`/products/${product.image}`}
                                            component='img'
                                            sx={{borderRadius: '5px'}}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>                        
                        </Grid>                        
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{product.title}</Typography>
                                <Typography variant='body1'>Talla: <strong>{product.size}</strong> </Typography>
                                                                
                                {
                                    editable 
                                    ? (
                                        <ItemCounter 
                                            currentValue={ product.quantity } 
                                            maxValue={ 10 } //regla de negocio
                                            updateQuantity={(value) => onNewCartQuantityValue(product, value) }                                        
                                        />
                                    )
                                    : (
                                        <Typography variant='h5'>{product.quantity} {product.quantity>1?'productos':'producto'}</Typography>
                                    )
                                }
                                

                            </Box>                        
                        </Grid>                        
                        <Grid 
                            item xs={2} 
                            display='flex'
                            alignItems='center'
                            flexDirection='column'
                        >                            
                            <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
                        
                            {
                                editable && (
                                    <Button 
                                        variant='text' 
                                        color='secondary' 
                                        onClick={() => removeCartProduct(product)}
                                    >
                                        Remover
                                    </Button>
                                )
                                    
                            }
                            
                        
                        </Grid>                        

                    </Grid>
                ))
            }
        </>
    )
}
