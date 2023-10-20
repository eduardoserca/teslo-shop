import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from "next-auth";
import { useRouter } from 'next/router';
import { PayPalButtons } from "@paypal/react-paypal-js"

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined} from '@mui/icons-material';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { tesloApi } from '@/api';



interface Props {
    order: IOrder;
}

type OrderResponseBody = {
    id: string;
    status:
        | "CREATED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "COMPLETED"
        | "PAYER_ACTION_REQUIRED";
}

const OrderPage:NextPage<Props> = ({ order }) => {
    
    const router = useRouter();
    const { shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);
    
    const onOrderCompleted = async( details: OrderResponseBody ) => {

        if( details.status !== "COMPLETED" ){
            return alert("No hay pago en PayPal");
        }

        setIsPaying(true);

        try {

            const { data } = await tesloApi.post('/orders/pay',{
                transactionId: details.id,
                orderId: order._id,
            });

            router.reload();

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert(error);
        }

    }

    return (
        <ShopLayout 
            title='Resumen de la orden' 
            pageDescription='Resumen de la orden'>
            
            <Typography 
                variant="h1" 
                component="h1">Orden: { order._id } </Typography>

            {
                order.isPaid
                ?(
                    <Chip 
                        sx={{my:2}}
                        label="Orden ya fue pagada"
                        variant="outlined"
                        color="success"
                        icon={<CreditScoreOutlined />}
                    />

                ):
                (
                    <Chip 
                        sx={{my:2}}
                        label="Pendiente de pago"
                        variant="outlined"
                        color="error"
                        icon={<CreditCardOffOutlined />}
                    />
                )
            }
            


            <Grid container spacing={2} className='fadeIn'>
                <Grid item xs={12} sm={7}>

                    <CartList products={ order.orderItems } />

                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({order.numberOfItems} { order.numberOfItems> 1 ?'productos':'producto'})</Typography>
                            <Divider sx={{my:1}} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant="subtitle1">Dirección de entrega</Typography>
                            </Box>
                            
                            <Typography >{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                            <Typography >{ shippingAddress.address } { shippingAddress.address2 ? `, ${shippingAddress.address2}`: '' }</Typography>
                            <Typography >{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                            <Typography >{ shippingAddress.country }</Typography>
                            <Typography >{ shippingAddress.phone }</Typography>

                            <Divider sx={{ my:1}} />

                            <OrderSummary 
                                orderValues={
                                    {
                                        numberOfItems: order.numberOfItems,
                                        subTotal: order.subTotal,
                                        tax: order.tax,
                                        total: order.total,
                                    }
                                } />

                            <Box sx={{ mt:3 }}  display="flex" flexDirection="column">
                                {/** todo */}
                                <Box 
                                    display="flex" 
                                    justifyContent="center" 
                                    className="fadeIn"
                                    sx={{display: isPaying ? 'flex':'none'}}>
                                    <CircularProgress />
                                </Box>

                                <Box 
                                    flexDirection="column"                                    
                                    sx={{display: isPaying ? 'none':'flex'}}>

                                    {
                                        order.isPaid
                                        ? (
                                            <Chip 
                                                sx={{my:2}}
                                                label="Orden ya fue pagada"
                                                variant="outlined"
                                                color="success"
                                                icon={<CreditScoreOutlined />}
                                            />

                                        ):(
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units:[
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                }
                                                            }

                                                        ],                                                    
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture()
                                                        .then((details) => {
                                                            onOrderCompleted(details);
                                                            //const name = details.payer.name.given_name;
                                                            
                                                        });
                                                }}
                                            />
                                        )
                                    }
                                    
                                </Box>
                            </Box>


                        </CardContent>
                        
                    </Card>
                </Grid>
            </Grid>

        </ShopLayout>
    )
}



export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    
    const { id = '' } = query;
    const session: any = await getServerSession(req, res, authOptions );
    if( !session ){
        return {
            redirect: {
                destination:`/auth/login?p=/orders/${ id }`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString());
    if( !order ){
        return {
            redirect: {
                destination:'/orders/history',
                permanent: false
            }
        }
    }

    if( order.user !== session.user._id){
        return {
            redirect: {
                destination:'/orders/history',
                permanent: false
            }
        }
    }


    return {
        props: {
            order
        }
    }
}


export default OrderPage
