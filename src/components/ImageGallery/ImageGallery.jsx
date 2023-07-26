import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import { List } from './ImageGallery.styled';

const ImageGallery = ({ items, openModal }) => {
  return (
    <List className="gallery">
      {items.map(item => {
        return (
          <ImageGalleryItem
            openModal={openModal}
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
