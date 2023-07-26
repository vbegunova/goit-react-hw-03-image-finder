import { LoadMore } from './Button.styled';

const Button = ({ handleClick }) => {
  return <LoadMore onClick={handleClick}>Load more</LoadMore>;
};

export default Button;
