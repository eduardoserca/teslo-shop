import { useContext, useState } from 'react';
import NextLink from "next/link";
import { useRouter } from "next/router";

import { AppBar, Toolbar, Link, Typography, Box, Button} from '@mui/material';

import { CartContext, UiContext } from "@/context";


export const AdminNavbar = () => {

    const {asPath, push} = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;

        push(`/search/${searchTerm}`);

    }

    

    return(
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1}/>
                
                <Button onClick={ toggleSideMenu }>Menú</Button>


            </Toolbar>
        </AppBar>
    );
}


