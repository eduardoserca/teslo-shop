import axios from "axios";

export const getPaypalBearerToken = async ():Promise<string|null> => {
    
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