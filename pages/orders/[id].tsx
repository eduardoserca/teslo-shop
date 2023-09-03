import NextLink from "next/link";
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts"
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined} from '@mui/icons-material';


const OrderPage = () => {
    return (
        <ShopLayout 
            title='Resumen de la orden 1234567890' 
            pageDescription='Resumen de la orden'>
            
            <Typography 
                variant="h1" 
                component="h1">Orden: 1234567890 </Typography>

            {/** 
                <Chip 
                sx={{my:2}}
                label="Pendiente de pago"
                variant="outlined"
                color="error"
                icon={<CreditCardOffOutlined />}
            />
            */}

            <Chip 
                sx={{my:2}}
                label="Orden ya fue pagada"
                variant="outlined"
                color="success"
                icon={<CreditScoreOutlined />}
            />

            


            <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen (3 productos)</Typography>
                            <Divider sx={{my:1}} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant="subtitle1">Dirección de entrega</Typography>
                                
                                <NextLink href="/checkout/address" passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            
                            <Typography >Carlos Serrano</Typography>
                            <Typography >323 Algún lugar</Typography>
                            <Typography >Village People, HYA 235</Typography>
                            <Typography >Perú</Typography>
                            <Typography >+51 85427516</Typography>

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
                                {/** todo */}
                                <h1>
                                    PAGAR
                                </h1>
                                <Chip 
                                    sx={{my:2}}
                                    label="Orden ya fue pagada"
                                    variant="outlined"
                                    color="success"
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>


                        </CardContent>
                        
                    </Card>
                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default OrderPage
