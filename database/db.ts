import mongoose from 'mongoose';

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
    isConnected: 0
}

export const connect = async() => {
    try {        

        if ( mongoConnection.isConnected === 1 ) {
            console.log('connect -> Ya estábamos conectados');
            return;
        }

        if ( mongoose.connections.length > 0 ) {
            
            if(mongoose.connections[0].readyState === 1){//Ya existe una conexión y se reutiliza
                mongoConnection.isConnected = mongoose.connections[0].readyState;                
                console.log('connect -> Usando conexión anterior');
                return; 
            }
        }
        
        await mongoose.connect( process.env.MONGO_URL || '');
        mongoConnection.isConnected = 1;
        console.log('connect -> Conectado a MongoDB:', process.env.MONGO_URL );
        
    } catch (error) {
        console.log('connect -> Error al conectarse a la BD' );
        console.log(error);
    }

    
}

export const disconnect = async() => {
    
    //if ( process.env.NODE_ENV === 'development' ) return;
    
    if ( mongoConnection.isConnected === 0 ) {
        return;
    }

    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    
    console.log('disconnect -> Desconectado de MongoDB');
}