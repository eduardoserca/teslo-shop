
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IPaypal } from '@/interfaces';
import { db } from '@/database';
import { Order } from '@/models';
import { PaypalUtil } from '@/utils';


type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ){
        case 'POST':
            return payOrder(req, res);

        default:
            return res.status(400).json({ message: 'Bad request'});
    }    
}

/*
const getPaypalBearerToken = async ():Promise<string|null> => {
    
    const base64Token = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`, 'utf-8').toString('base64');
    //creando el body en base 64
    const body=new URLSearchParams('grant_type=client_credentials');
    
    try {
        const {data} = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': `Basic ${base64Token}`
            },
            
        });

        return data.access_token;
        
    } catch (error) {
        if( axios.isAxiosError(error) ){
            console.error(error.response?.data);
        }else{
            console.error(error);
        }

        return null;        
    }
}
*/

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const paypalBearerToken = await PaypalUtil.getPaypalBearerToken();

    if(!paypalBearerToken){
        return res.status(400).json({ message: 'No se pudo generar el token de PayPal'});
    }

    const { transactionId, orderId } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {             
            'Authorization': `Bearer ${paypalBearerToken}`,
        },
    });    
    
    if( data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'Orden no reconocida'});
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);

    if(!dbOrder){
        await db.disconnect();
        return res.status(401).json({ message: 'Orden no existe en la base de datos'});
    }

    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect();
        return res.status(401).json({ message: 'Los montos de Paypal y nuestra orden no son iguales'});
    }

    dbOrder.transactionId = transactionId; //Id de transacción de Paypal
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();



    return res.status(200).json({ message: 'Orden pagada'});
}
