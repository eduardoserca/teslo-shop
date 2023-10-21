import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import Cookies from 'js-cookie';

import { CartContext } from '@/context';
import { ShopLayout } from "@/components/layouts"
import { countries } from "@/utils";
import { IAddress } from '@/interfaces';


type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = ():FormData => {
    const shippingAddress:FormData = Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')!) : undefined ;    
    return shippingAddress;
}


const AddressPage = () => {

    const router =  useRouter();
    
    const { updateAddress, shippingAddress } = useContext(CartContext);
    

    const { register, handleSubmit, formState:{errors}, setValue, getValues } = useForm<FormData>({
        defaultValues: getAddressFromCookies()        
    });

    const onSubmitAddress = async(data: FormData) => {        
        updateAddress(data);                
        router.push('/checkout/summary');        
    }

    

    return (
        <ShopLayout 
            title="Dirección" 
            pageDescription="Confirmar dirección del destino">
            
            <form onSubmit={ handleSubmit(onSubmitAddress) } noValidate>
            
                <Typography variant="h1" component="h1">Dirección</Typography>

                <Grid container spacing={2} sx={{mt:2}}>

                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Nombre' 
                            variant="filled" 
                            fullWidth
                            {
                                ...register('firstName', {
                                    required: 'Este campo es requerido',
                                })
                            }
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Apellido' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('lastName', {
                                    required: 'Este campo es requerido',
                                })
                            }
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Dirección' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('address', {
                                    required: 'Este campo es requerido',
                                })
                            }
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Dirección 2 (opcional)' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('address2')
                            }                            
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Código postal' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('zip', {
                                    required: 'Este campo es requerido',
                                })
                            }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Ciudad' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('city', {
                                    required: 'Este campo es requerido',
                                })
                            }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>   
                            <TextField
                                key={shippingAddress?.country || countries[0].code}
                                select
                                variant="filled"
                                label="País"
                                defaultValue={ shippingAddress?.country || countries[0].code }
                                { ...register('country', {
                                    required: 'Este campo es requerido'
                                })}
                                error={ !!errors.country }
                                // helperText={ errors.country?.message }
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem key={country.code} value={country.code} > {country.name} </MenuItem>
                                    ))
                                }
                                
                            </TextField>                
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Teléfono' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('phone', {
                                    required: 'Este campo es requerido',
                                })
                            }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>

                </Grid>

                <Box sx={{mt:5}} display='flex' justifyContent='center'>
                    <Button 
                        type='submit'
                        color="secondary" 
                        className="circular-btn" 
                        size="large">
                        Revisar pedido
                    </Button>
                </Box>

            </form>
                
        </ShopLayout>
    )
}

export default AddressPage
