import { FC } from 'react';
import { Grid, Typography } from '@mui/material';

interface Props {

}
export const OrderSummary:FC<Props> = ({}) => {
    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>3 items</Typography>
            </Grid>

            <Grid item xs={6} >
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{`$${155.36}`}</Typography>
            </Grid>

            <Grid item xs={6} >
                <Typography>Impuestos(15%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{`$${33.34}`}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt:2 }}>
                <Typography variant='subtitle1'>Total</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{`$${105.34}`}</Typography>
            </Grid>
        </Grid>
    )
}
