import { FC } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

import styles from "./ProductSlideshow.module.css";
import { IImage } from '@/interfaces';

interface Props{
  images: IImage[]
}

export const ProductSlideshow:FC<Props> = ({ images }) => {
  
  return (
    <Slide
      easing='ease'
      duration={7000}
      indicators
    >
      {
        images.map(image => {
          const url = image.path.includes('cloudinary.com') 
            ? image.path
            : `/products/${image.path}`;
          
          return (
            <div className={ styles['each-slide'] } key={image.id}>
              <div style={{
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover'
              }}>

              </div>
            </div>
          )
        })
      }

    </Slide>
  )
}
