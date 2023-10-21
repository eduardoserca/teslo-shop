import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import {v2 as cloudinary } from "cloudinary";
import { IImage } from '@/interfaces';


cloudinary.config( process.env.CLOUDINARY_URL || '');

type Data = 
    |{message : string}
    |IImage

export const config = {
    api: {
        bodyParser: false,
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':            
            return uploadFile(req, res);
        
        case 'DELETE':            
            return deleteFile(req, res);
    
        default:
            return res.status(400).json({ message : 'Bad request' });
    }
    
}


const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {    

    const {public_id, secure_url } = await parseFiles(req);
    const image: IImage = {id: public_id, path: secure_url};
    return res.status(200).json(image);
}

const parseFiles = async (req: NextApiRequest):Promise<{public_id:string, secure_url:string}> => {
    const form = new multiparty.Form();

    return await new Promise((resolve,reject) => {

        form.parse(req, async(err, fields, files) => {

            if (err){
                reject(err);
            }
            
            for(const {path} of files.file){
                const {public_id, secure_url } = await saveFile( path );
                resolve({public_id,secure_url});            
            }   
        });

    });
    
}

const saveFile =async (path: string ): Promise<{public_id:string, secure_url:string}> => {
    
    const {public_id, secure_url } = await cloudinary.uploader.upload( path );

    return {public_id, secure_url };    
}

const deleteFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { img_id = ''} = req.query as { img_id:string };    
    
    if(img_id.includes('.jpg')){
        //Eliminamos la img de la BD Mongo
        console.log('TODO: Eliminamos la Imagen de mongo db');
    }else{
        //Eliminamos la img de Cloudinary
        await deletedImageCloudinary(img_id);
    }    
    
    return res.status(200).json({message:`Imagen eliminada con éxito ID: ${img_id}`});
}

const deletedImageCloudinary = async (public_id:string) =>{
    const result = await cloudinary.uploader.destroy( public_id );    
    return;
}

