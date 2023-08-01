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

  state = {
    query: '',
    data: [],
    isLoading: false,
    isModalOpen: false,
    image: '',
    error: null,
    page: 1,
    totalPages: 0,
  };

  componentDidUpdate = async (_, prevState) => {
    const { query, page } = this.state;
    if (prevState.query !== query || prevState.page !== page) {
      if (query === '') {
        this.setState({
          data: [],
        });
        return;
      }

      try {
        if (this.abortCtrl !== null) {
          this.abortCtrl.abort();
        }
        this.abortCtrl = new AbortController();

        if (page === 1) {
          this.setState({
            data: [],
          });
        }

        this.setState({
          isLoading: true,
          error: null,
        });

        const fetchedData = await fetchItems(query, page, this.abortCtrl);
        if (fetchedData.totalHits === 0) {
          this.setState({
            error: 'Please, enter a correct query.',
          });
          return;
        }

        const items = this.getNormilizedItem(fetchedData.hits);

        this.setState(
          prevState => ({
            data: [...prevState.data, ...items],
            totalPages: Math.ceil(fetchedData.totalHits / 12),
          }),
          () => {
            if (page !== 1) {
              window.scrollBy({
                top: 300 * 3,
                behavior: 'smooth',
              });
            }
          }
        );
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

  getNormilizedItem = arr => {
    return [...arr].map(item => {
      return {
        id: item.id,
        webformatURL: item.webformatURL,
        largeImageURL: item.largeImageURL,
      };
    });
  };

  handleSubmit = (input, error) => {
    this.setState({
      totalPages: 0,
      page: 1,
      query: input,
      error: error,
    });
  };

  setPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

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
    const { data, isLoading, isModalOpen, image, error, page, totalPages } =
      this.state;
    console.log(totalPages);
    const verify =  
    // totalPages !== 0 && 
    totalPages !== page && !error;

    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        {data[0] && <ImageGallery items={data} openModal={this.openModal} />}
        {data[0] && verify && <Button handleClick={this.setPage} />}
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

  // componentDidUpdate = async (prevProps, prevState) => {
  //   const { query, page } = this.state;
  //   if (prevState.query !== query ) {
  //     if (query === '') {
  //       this.setState({
  //         data: [],
  //       });
  //       return;
  //     }

  //     try {
  //       if (this.abortCtrl !== null) {
  //         this.abortCtrl.abort();
  //       }
  //       this.abortCtrl = new AbortController();

  //       this.setState({
  //         data: [],
  //         isLoading: true,
  //         error: null,
  //       });

  //       const fetchedData = await fetchItems(query, page, this.abortCtrl);
  //       this.totalItems = fetchedData.totalHits;

  //       if (this.totalItems === 0) {
  //         this.setState({
  //           error: 'Please, enter correct query.',
  //         });
  //         return;
  //       }
  //       const items = this.getNormilizedItem(fetchedData.hits);

  //       this.setState(prevState => ({
  //         data: [...prevState.data, ...items],
  //       }));
  //     } catch (error) {
  //       if (error.code !== 'ERR_CANCELED') {
  //         this.setState({
  //           error: ERR_MESSAGE,
  //         });
  //       }
  //     } finally {
  //       this.setState({
  //         isLoading: false,
  //       });
  //     }
  //   }
  // };

  // loadingImages = async () => {
  //   const { query, page } = this.state;
  //   const totalPages = this.calculateTotalPages();

  //   if (totalPages > 1) {
  //     this.setState(prevState => ({
  //       page: prevState.page + 1,
  //     }));

  //     try {
  //       this.abortCtrl = new AbortController();
  //       this.setState({
  //         isLoading: true,
  //         error: null,
  //       });

  //       const fetchedData = await fetchItems(query, page, this.abortCtrl);
  //       const items = [...fetchedData.hits].map(item => {
  //         return {
  //           id: item.id,
  //           webformatURL: item.webformatURL,
  //           largeImageURL: item.largeImageURL,
  //         };
  //       });

  //       if (items) {
  //         this.setState(
  //           prevState => ({
  //             data: [...prevState.data, ...items],
  //           }),
  //           () => {
  //             window.scrollBy({
  //               top: 300 * 3,
  //               behavior: 'smooth',
  //             });
  //           }
  //         );
  //       }
  //     } catch (error) {
  //       this.setState({
  //         error: ERR_MESSAGE,
  //       });
  //     } finally {
  //       this.setState({
  //         isLoading: false,
  //       });
  //     }
  //   }
  // };

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

  // loadingImages = async () => {
  //   const { query, page } = this.state;
  //   const totalPages = this.calculateTotalPages();

  //   if (totalPages > 1) {
  //     this.setState(prevState => ({
  //       page: prevState.page + 1,
  //     }));

  //     try {
  //       this.abortCtrl = new AbortController();
  //       this.setState({
  //         isLoading: true,
  //         error: null,
  //       });

  //       const fetchedData = await fetchItems(query, page, this.abortCtrl);
  //       const items = [...fetchedData.hits].map(item => {
  //         return {
  //           id: item.id,
  //           webformatURL: item.webformatURL,
  //           largeImageURL: item.largeImageURL,
  //         };
  //       });

  //       if (items) {
  //         this.setState(
  //           prevState => ({
  //             data: [...prevState.data, ...items],
  //           }),
  //           () => {
  //             window.scrollBy({
  //               top: 300 * 3,
  //               behavior: 'smooth',
  //             });
  //           }
  //         );
  //       }
  //     } catch (error) {
  //       this.setState({
  //         error: ERR_MESSAGE,
  //       });
  //     } finally {
  //       this.setState({
  //         isLoading: false,
  //       });
  //     }
  //   }
  // };
}
