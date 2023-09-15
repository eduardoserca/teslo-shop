import jwt from 'jsonwebtoken';
import { jwtVerify }  from 'jose';

export const signToken = (_id: string , email: string): string => {
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    return jwt.sign(
        //payload
        {_id, email},

        //Seed
        process.env.JWT_SECRET_SEED,

        //Opciones
        { expiresIn: '30d'}
    )

}

export const isValidToken = ( token:string ):Promise<string> => {   


    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    return new Promise((resolve, reject) => {
        try {
            jwt.verify( token, process.env.JWT_SECRET_SEED || '', (err, payload)=>{
                if(err) return reject('JWT no es valido');

                const {_id} = payload as {_id: string};
                resolve(_id);
            } )
        } catch (error) {            
            reject('JWT no es valido');
        }
    });
}

export const isValidTokenByJoseLib = async ( token:string ):Promise<string> => {    
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    try {
        const { payload } = await  jwtVerify(
            token, 
            new TextEncoder().encode(process.env.JWT_SECRET_SEED),
            );
        
            const { _id } = payload as {_id:string};

        return _id;
        
    } catch (error) {
        console.error(error);
        throw new Error('Token invalido');
    }
    
}
