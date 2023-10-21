export interface IProduct {
    _id:string;
    description: string;
    //images: string[];
    images: IImage[];

    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    gender: IGender;

    //TODO: agregar createdAt y updatedAt
    createdAt: string;
    updatedAt: string;
}

export interface IImage {
    id  :   string,
    path:   string,
}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';
export type IGender = 'men'|'women'|'kid'|'unisex';