import { Component } from 'react';
import { fetchItems } from './api/api';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import Error from './Error';

const ERR_MESSAGE =
  'Oops, sorry, something went wrong, try reloading this page.';

export class App extends Component {
  abortCtrl = null;
  totalItems;
  page = 1;

  state = {
    query: '',
    data: [],
    isLoading: false,
    isModalOpen: false,
    image: '',
    error: null,
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { query } = this.state;
    if (prevState.query !== query) {
      this.setState({
        data: [],
      });
      this.page = 1;

      try {
        if (this.abortCtrl !== null) {
          this.abortCtrl.abort();
        }
        this.abortCtrl = new AbortController();

        this.setState({
          isLoading: true,
          error: null,
        });

        const fetchedData = await fetchItems(query, this.page, this.abortCtrl);
        this.totalItems = fetchedData.totalHits;
        if (this.totalItems === 0) {
          this.setState({
            error: 'Please, enter correct query.',
          });
          return;
        }
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
        if (error.code !== 'ERR_CANCELED') {
          this.setState({
            error: ERR_MESSAGE,
          });
        }
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  componentWillUnmount = () => {
    this.abortCtrl.abort();
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { query } = e.target;
    const normalizedQuery = query.value.trim();

    const containsInvalidCharacters = /[&?!@#$^*()_=+№;:'"%0-9]/.test(
      normalizedQuery
    );

    if (normalizedQuery === '' || containsInvalidCharacters) {
      this.setState({
        error: 'Please, enter a correct query.',
      });
    } else {
      this.setState({
        query: normalizedQuery,
        error: null,
      });
    }

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
        this.abortCtrl = new AbortController();
        this.setState({
          isLoading: true,
          error: null,
        });

        const fetchedData = await fetchItems(query, this.page, this.abortCtrl);
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
        this.setState({
          error: 'Oops, sorry, something went wrong, try reloading this page',
        });
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  // fetchData = async ({ query, page }) => {
  //   const fetchedData = await fetchItems(query, page);
  //   const items = [...fetchedData.hits].map(item => {
  //     return {
  //       id: item.id,
  //       webformatURL: item.webformatURL,
  //       largeImageURL: item.largeImageURL,
  //     };
  //   });

  //   return items;
  // };

  openModal = image => {
    this.setState({
      isModalOpen: true,
      image: image,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render() {
    const { query, data, isLoading, isModalOpen, image, error } = this.state;
    const totalPages = this.calculateTotalPages();
    const verify =
      totalPages !== 1 &&
      totalPages !== 0 &&
      totalPages !== this.page &&
      !error;

    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        {data[0] && <ImageGallery items={data} openModal={this.openModal} />}
        {!isLoading && query && verify && (
          <Button handleClick={this.loadingImages} />
        )}
        {isLoading && <Loader />}
        {error && !isLoading && <Error error={error} />}
        {/* <Modal
          isOpen={isModalOpen}
          image={image}
          onClose={this.closeModal}
        /> */}
        {isModalOpen && <Modal image={image} onClose={this.closeModal} />}
      </>
    );
  }
}
