import { Item, Image } from "./ImageGalleryItem.styled";

const ImageGalleryItem = ({ image, largeImage, openModal }) => {
  return (
    <Item onClick={() => openModal(largeImage)}>
      <Image src={image} alt="largeImage" />
    </Item>
  );
};

export default ImageGalleryItem;
