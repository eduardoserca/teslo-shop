import { IProduct } from "@/interfaces";
import mongoose, {Schema, model, Model } from "mongoose";

const productSchema = new Schema({
    description: {type:String, require: true, default:''},
    //images: [{type:String, }],

    images: [{
        id: {type: String, required: true},
        path: {type: String, required: true},
    }],

    inStock: {type:Number, require: true, default:0},
    price: {type:Number, require: true, default:0},
    sizes: [{
        type: String, 
        enum:{
            values:['XS','S','M','L','XL','XXL','XXXL'],
            message:'{VALUE} no es un tamaño valido'
        }
    }],
    slug:{type: String, require: true, unique: true},
    tags:[{type: String}],
    title:{type: String, require: true, default:''},
    type:{
        type: String, 
        enum:{
            values:['shirts','pants','hoodies','hats'],
            message:'{VALUE} no es un tipo valido'
        }
        , default:'shirts'
    },
    gender:{
        type: String, 
        enum:{
            values:['men','women','kid','unisex'],
            message:'{VALUE} no es un genero valido'
        }
        , default:'women'
    }
},{
    timestamps: true
});

// TODO: Crear indices en Mongo
productSchema.index({title:'text', tags: 'text'});

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;