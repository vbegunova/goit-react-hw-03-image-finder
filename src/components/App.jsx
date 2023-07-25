import { Component } from 'react';
import { fetchItems } from './api/api';
import Searchbar from './Searchbar/Searchbar';

// api key 36694393-8bc689be0a863a766f731264d

export class App extends Component {
  state = {
    query: '',
  };

  componentDidUpdate = async (prevProps, prevState) => {
    console.log(this.state.query)
    try {
      const data = await fetchItems(this.state.query);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { query } = e.target

    this.setState({
      query: query.value,
    })
  }

  render() {
    return (
      <Searchbar onSubmit={this.handleSubmit}/>
    );
  }
}
