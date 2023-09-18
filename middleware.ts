import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse  } from "next/server";

export async function middleware(req: NextRequest, ev:NextFetchEvent){
    
    const session =  await getToken({req, secret:process.env.NEXTAUTH_SECRET});
    
    if(!session) {
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
    
}

// See "Matching Paths" below to learn more
export const config = {
    //matcher: '/checkout/:path*',
    matcher: ['/checkout/address', '/checkout/summary'],
}