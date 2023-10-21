import { NextFetchEvent, NextRequest, NextResponse  } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(req: NextRequest | any, ev:NextFetchEvent){    

    const session: any =  await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const requestedPage: string = req.nextUrl.pathname;

    //No existe sesión activa
    if(!session) {
        
        //Al invocar el api/admin        
        if(requestedPage.includes('/api/admin/dashboard')){
            return new Response( JSON.stringify({ message: 'No autenticado'}), {
                status: 401,
                headers:{
                    'Content-Type':'application/json'
                }
            })
        }
        
        //Desde la pagina web
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;

        return NextResponse.redirect(url);
    }

    //Validando Roles
    const validRoles = ['admin', 'super-user', 'SEO'];
    if( !validRoles.includes(session.user.role) ){

        //Desde la invocación de la api/admin        
        if(requestedPage.includes('/api/admin/dashboard')){
            return new Response( JSON.stringify({ message: 'No autorizado'}), {
                status: 403,
                headers:{
                    'Content-Type':'application/json'
                }
            })            
        }

        //Desde la pagina web
        if(requestedPage.includes('/admin')){            
            return NextResponse.redirect( new URL('/', req.url));          
        }
    }     

    return NextResponse.next();    
}



// See "Matching Paths" below to learn more
export const config = {
    //matcher: '/checkout/:path*',
    matcher: 
    [
        '/checkout/address', 
        '/checkout/summary',
        '/admin/:path*',
        '/api/admin/dashboard',
    ],
}