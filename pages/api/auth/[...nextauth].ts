import NextAuth  from "next-auth";
import type { NextAuthOptions } from 'next-auth';

import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import {dbUsers} from "../../../database";


export const authOptions: NextAuthOptions = {
    
    // Configure one or more authentication providers
    providers: [
        
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com'  },
                password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña'  },
            },

            async authorize(credentials) {
                
                const { _id, email, role, name }  = await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
                
                return { _id, email, role, name } as any;
            }
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            }),
            // ...add more providers here
    ],

    //agregado para desplegar en Vercel
    secret: process.env.NEXT_PUBLIC_SECRET,

    //Custom Page
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    session:{
        maxAge: 2592000, //30 Dias
        strategy: 'jwt',
        updateAge: 86400 // cada dia se actualiza
    },

    //Callbacks
    callbacks:{

        async jwt({ token, account, user }) {

            if( account ){
                token.accessToken = account.access_token;
                switch ( account.type ) {
                    case 'oauth':
                        token.user = await dbUsers.oAuthToDbUser(user.email || '', user.name || '');
                        break;

                    case 'credentials':
                        token.user = user;
                        break;
                }
            }
            return token;
        },

        async session({session, token, user}){            
            session.accessToken = token.accessToken as string;
            session.user = token.user as any;
            return session;
        }

    }

}
export default NextAuth(authOptions)