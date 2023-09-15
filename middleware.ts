import { NextFetchEvent, NextRequest, NextResponse  } from "next/server";

import { jwt } from "@/utils";


export async function middleware(req: NextRequest, ev:NextFetchEvent){
    
    const token = req.cookies.get('token');
    const requestedPage = req.nextUrl.pathname;
    
    try {
        const { value } = token as {name:string, value:string};            
        await jwt.isValidTokenByJoseLib( value );    
        return NextResponse.next();  

    } catch (error) {
        return NextResponse.redirect(new URL(`/auth/login?p=${requestedPage}`, req.url));
    }
    
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/checkout/:path*',
}