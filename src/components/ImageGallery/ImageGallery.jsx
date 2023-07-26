import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import { List } from './ImageGallery.styled';

const ImageGallery = ({ items }) => {
  return (
    <List className="gallery">
      {items.map(item => {
        return (
          <ImageGalleryItem
            key={item.id}
            image={item.webformatURL}
            largeImage={item.largeImageURL}
          />
        );
      })}
    </List>
  );
};

export default ImageGallery;
