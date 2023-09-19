import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { signIn , getSession, getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from './../api/auth/[...nextauth]';

import { Box, Grid, Typography, TextField, Button, Link, Chip, Divider } from '@mui/material';
import { ErrorOutline } from "@mui/icons-material";

import { AuthLayout } from "@/components/layouts";
import { validations } from "@/utils";




type FormData = {
    email: string;
    password: string;
}

const LoginPage = () => {

    const router = useRouter();    

    const { register, handleSubmit, formState:{errors} } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then( prov => {            
            setProviders(prov);
        });

    }, [])
    


    const onLoginUser = async({email, password}: FormData) => {
        setShowError(false);

        

        await signIn('credentials', {email, password});
    }

    return (
        <AuthLayout title={"Ingresar"} >
            <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
                <Box sx={{width: 350, padding:'10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Iniciar sesión</Typography>
                            <Chip 
                                label="No reconocemos ese usuario/contraseña"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{display: showError ? 'flex': 'none'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Correo" 
                                type="email" 
                                variant="filled" 
                                fullWidth
                                {
                                    ...register('email', {
                                        required: 'Este campo es requerido',
                                        validate: (val) => validations.isEmail(val)
                                    })                                    
                                }

                                error={!!errors.email}
                                helperText={errors.email?.message}

                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Contraseña" 
                                type="password" 
                                variant="filled" 
                                fullWidth
                                {
                                    ...register('password', {
                                        required: 'Este campo es requerido',
                                        minLength: { value:6, message: 'Mínimo 6 caracteres'}
                                    })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit"
                                color="secondary" 
                                className="circular-btn" 
                                size="large" 
                                fullWidth>
                                Ingresar
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center'>
                            <NextLink href={ router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} passHref legacyBehavior>
                                <Link underline="always">
                                    Regístrate y crea una cuenta
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid 
                            item 
                            xs={12} 
                            display='flex' 
                            flexDirection='column'
                            justifyContent='center'>
                            <Divider sx={{width: '100%', mb:2 }} />
                            {
                                Object.values(providers).map((provider:any)=>{

                                    if(provider.id === 'credentials'){
                                        return (<div key="credentials"></div>)
                                    }

                                    return (
                                        <Button
                                            key={provider.id}                                            
                                            fullWidth
                                            variant='outlined'
                                            color="primary" 
                                            sx={{ mb: 1}}
                                            onClick={()=> signIn(provider.id) }                                       
                                        >
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }

                        </Grid>        

                    </Grid>
                </Box>
            </form>
            
        </AuthLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, res, query }) => {
    //const session = await getSession({req});
    
    const session = await getServerSession(req, res, authOptions );

    const { p='/'} = query;

    if(session){
        return {
            redirect:{
                destination: p.toString() ,
                permanent: false
            }
        }
    }

    return {
        props: { }
    }
}

export default LoginPage
