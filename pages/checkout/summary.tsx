import { useContext } from "react";
import NextLink from "next/link";

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link } from '@mui/material';

import { CartContext } from "@/context";
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { countries } from "@/utils";


const SummaryPage = () => {

    const { shippingAddress, numberOfItems } = useContext(CartContext);

    if(!shippingAddress){
        return (<></>);
    }

    const {firstName, lastName, address, city, country, phone, zip, address2 = ''} = shippingAddress;


    return (
        <ShopLayout 
            title='Resumen de la orden' 
            pageDescription='Resumen de la orden'>
            
            <Typography 
                variant="h1" 
                component="h1">Resumen de la orden</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto': 'productos' })</Typography>
                            <Divider sx={{my:1}} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant="subtitle1">Dirección de entrega</Typography>
                                
                                <NextLink href="/checkout/address" passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            
                            <Typography >{firstName} {lastName}</Typography>
                            <Typography >{address} {address2 ? `, ${address2}` : ''}</Typography>
                            <Typography >{city}, {zip}</Typography>
                            <Typography >{ countries.find( (c) => c.code === country)?.name }</Typography>
                            <Typography >{ phone }</Typography>

                            <Divider sx={{ my:1}} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href="/cart" passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>


                            <OrderSummary />

                            <Box sx={{ mt:3 }}>
                                <Button color="secondary" className="circular-btn" fullWidth>
                                    Confirmar Orden
                                </Button>

                            </Box>


                        </CardContent>
                        
                    </Card>
                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default SummaryPage
