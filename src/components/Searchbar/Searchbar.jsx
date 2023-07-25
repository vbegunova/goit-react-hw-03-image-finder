import { Header, SearchButton, SearchButtonLabel, SearchForm, SearchInput } from './Searchbar.styled';
import { FaSearch } from "react-icons/fa";

const Searchbar = ({ onSubmit }) => {
  return (
    <Header>
      <SearchForm onSubmit={onSubmit}>
        <SearchButton type="submit">
            <FaSearch/>
          {/* <SearchButtonLabel>Search</SearchButtonLabel> */}
        </SearchButton>

        <SearchInput
          name="query"
          className="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </Header>
  );
};

export default Searchbar;
