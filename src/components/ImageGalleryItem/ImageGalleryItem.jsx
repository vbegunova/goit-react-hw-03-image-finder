import { Item, Image } from "./ImageGalleryItem.styled";

const ImageGalleryItem = ({ image, largeImage }) => {
  return (
    <Item>
      <Image src={image} alt="largeImage" />
    </Item>
  );
};

export default ImageGalleryItem;
