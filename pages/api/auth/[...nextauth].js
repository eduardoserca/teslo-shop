import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import {dbUsers} from "../../../database";


export const authOptions = {
    
    // Configure one or more authentication providers
    providers: [
        
        Credentials({
            name:' Custom Login',
            credentials: {
                email:{ label:'Correo:', type:'email', placeholder: 'correo@google.com' },
                password:{ label:'Contraseña:', type:'password', placeholder: 'contraseña' },
            },
            async authorize(credentials){                
                //TODO: validar credenciales
                return await dbUsers.checkUserEmailPassword(credentials.email, credentials.password);
            }

        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            }),
            // ...add more providers here
    ],

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
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        }

    }

}
export default NextAuth(authOptions)