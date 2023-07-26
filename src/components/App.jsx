import { Component } from 'react';
import { fetchItems } from './api/api';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';

// api key 36694393-8bc689be0a863a766f731264d

export class App extends Component {
  totalItems;
  page = 1;

  state = {
    query: '',
    data: [],
    isLoading: false,
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { query } = this.state;
    if (prevState.query !== query) {
      this.setState({
        data: [],
      });
      this.page = 1;

      try {
        this.setState({
          isLoading: true,
        });

        const fetchedData = await fetchItems(query);
        this.totalItems = fetchedData.totalHits;
        const items = [...fetchedData.hits].map(item => {
          return {
            id: item.id,
            webformatURL: item.webformatURL,
            largeImageURL: item.largeImageURL,
          };
        });

        if (items) {
          this.setState(prevState => ({
            data: [...prevState.data, ...items],
          }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { query } = e.target;

    this.setState({
      query: query.value,
    });

    query.value = '';
  };

  calculateTotalPages = () => {
    return Math.round(this.totalItems / 12);
  };

  loadingImages = async () => {
    const { query } = this.state;
    const totalPages = this.calculateTotalPages();
    if (totalPages > 1) {
      this.page += 1;

      try {
        this.setState({
          isLoading: true,
        });
        const fetchedData = await fetchItems(query, this.page);
        const items = [...fetchedData.hits].map(item => {
          return {
            id: item.id,
            webformatURL: item.webformatURL,
            largeImageURL: item.largeImageURL,
          };
        });

        if (items) {
          this.setState(
            prevState => ({
              data: [...prevState.data, ...items],
            }),
            () => {
              window.scrollBy({
                top: 300 * 3,
                behavior: 'smooth',
              });
            }
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  render() {
    const { query, data, isLoading } = this.state;
    const totalPages = this.calculateTotalPages();

    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery items={data} />
        {!isLoading &&
          query &&
          totalPages !== 1 &&
          totalPages !== this.page && (
            <Button handleClick={this.loadingImages} />
          )}
        {isLoading && <Loader />}
      </>
    );
  }
}
