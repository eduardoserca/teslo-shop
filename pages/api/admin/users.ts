import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
import { IUser } from '../../../interfaces/IUser';
import { isValidObjectId } from 'mongoose';


type Data = 
    |{message: string}
    |IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':            
            return getUsers(req, res);
        
        case 'PUT':            
            return updateUsers(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' });
    }


    
}

async function getUsers(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json(users);

}

async function updateUsers(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { userId = '', role='' } = req.body;

    if( !isValidObjectId(userId)){
        return res.status(400).json({ message: `El id no es valido, id: ${userId}`  });
    }

    const validRoles = ['admin', 'super-user', 'SEO', 'client'];   
    if( !validRoles.includes(role) ){
        return res.status(403).json({ message: `Rol no permitido, rol: ${role}`  });
    }


    await db.connect();

    const user = await User.findById(userId);
    if( !user){
        await db.disconnect();
        return res.status(404).json({ message: `Usuario no encontrado, id: ${userId}`  });
    }

    user.role =  role;
    await user.save();
    await db.disconnect();

    return res.status(201).json({message: 'Usuario actualizado'});
}

