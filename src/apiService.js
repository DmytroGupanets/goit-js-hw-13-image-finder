export default class ApiServiceRequest {
  constructor() {
    this.searchQuery = '';
    this.perPage = 12;
    this.pageNumber = 1;
    this.total = 0;
  }

  fetchSearch() {
    const API_KEY = '22061138-96faef093f4ee88d8ff48fa2c';
    const API_URL = 'https://pixabay.com/api';
    let url = `${API_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.pageNumber}&per_page=${this.perPage}&key=${API_KEY}`;

    return fetch(url)
      .then(response => response.json())
      .then(res => {
        this.numberOfMatches(res.total);
        this.pageIncrement();

        return res.hits;
      })
      .catch(console.log);
  }

  pageIncrement() {
    this.pageNumber += 1;
  }

  resetPageNumber() {
    this.pageNumber = 1;
  }

  getPageNumber() {
    return this.pageNumber;
  }

  numberOfMatches(number) {
    this.total = number;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}
