import { useContext, useState } from 'react';
import { GetServerSideProps ,  } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn, getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './../api/auth/[...nextauth]';

import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthContext } from '@/context';
import { AuthLayout } from "@/components/layouts";
import { validations } from '@/utils';





type FormData = {
    name: string;
    email: string;
    password: string;
}


const RegisterPage = () => {

    const router = useRouter();
    const {registerUser} = useContext(AuthContext);
    
    const { register, handleSubmit, formState:{errors} } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async( {name, email, password}: FormData ) => {
        
        setShowError(false);
        const {hasError, message} = await registerUser(name, email, password);

        if(hasError){
            setErrorMessage(message!);
            setShowError(true);            
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        //TODO: Navegar a la pantalla que estaba el usuario
        //const destination = router.query.p?.toString() || '/';
        //router.replace( destination );

        await signIn('credentials', {email, password});
        
    }


    return (
        <AuthLayout title={"Regístrate"} >
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{width: 350, padding:'10px 20px'}}>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Crear cuenta</Typography>
                            <Chip 
                                label="El correo ya fue registrado"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{display: showError ? 'flex': 'none'}}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label="Nombre completo" 
                                type="text" 
                                variant="filled" 
                                fullWidth
                                {
                                    ...register('name', {
                                        required: 'Este campo es requerido',
                                        minLength: { value:2, message: 'Mínimo 2 caracteres'}
                                    })                                    
                                }

                                error={!!errors.name}
                                helperText={errors.name?.message}
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
                                type='submit'
                                color="secondary" 
                                className="circular-btn" 
                                size="large" 
                                fullWidth>
                                Regístrate
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center'>                           
                            <NextLink href={ router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} passHref legacyBehavior>
                                <Link underline="always">
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
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

export default RegisterPage
