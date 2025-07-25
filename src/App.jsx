import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_KEY = '46ac2c5f';

const hindiMovieTitles = [
  'Animal',
  'Pathaan',
  'Jawan',
  'Gadar 2',
  'Rocky Aur Rani Ki Prem Kahani',
  'OMG 2',
  'Bhediya',
  'Tu Jhoothi Main Makkaar',
  'Bholaa',
  'Satyaprem Ki Katha',
  'The Kerala Story',
  'Sam Bahadur',
  'Tiger 3',
  'Dunki',
  'Laal Singh Chaddha',
  'Drishyam 2',
  'Kantara',
  'Raees',
  'Kabir Singh',
  'Andhadhun',
  'Kabhi Khushi Kabhie Gham',
  'Dilwale Dulhania Le Jayenge',
  '3 Idiots',
  'Zindagi Na Milegi Dobara',
  'Queen',
  'PK',
  'Chhichhore',
  'Barfi',
  'Tumbbad',
  'Masaan',
  'Gangs of Wasseypur',
  'Lagaan',
  'Dangal',
  'Bajrangi Bhaijaan',
  'Kabhi Alvida Naa Kehna',
  'Kal Ho Naa Ho',
  'Kabir Singh',
  'Chennai Express',
  'Dil Chahta Hai',
  'Kabhi Khushi Kabhie Gham',
  'Zindagi Na Milegi Dobara',
  'Raazi',
  'Tanu Weds Manu',
  'Tanu Weds Manu Returns',
  'Queen',
];

const App = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');

  const moviesPerPage = 8;

  const fetchHindiMovies = async () => {
    setLoading(true);
    try {
      const promises = hindiMovieTitles.map((title) =>
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const filtered = results.filter((movie) => movie.Response === 'True');
      setMovies(filtered);
    } catch (err) {
      console.error(err);
      alert('Error loading Hindi movies.');
    }
    setLoading(false);
  };

  const fetchMovies = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`);
      const data = await res.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
        setError('');
      } else {
        setMovies([]);
        setError(data.Error || 'No movies found.');
      }
    } catch (err) {
      setMovies([]);
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (!query.trim()) {
      fetchHindiMovies();
    } else {
      fetchMovies();
    }
  };

  const fetchMovieDetails = async (id) => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    const data = await res.json();
    setSelectedMovie(data);
  };

  useEffect(() => {
    fetchHindiMovies();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const paginatedMovies = movies.slice((page - 1) * moviesPerPage, page * moviesPerPage);

  return (
    // <div className={`container mt-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
    <div className={`${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ minHeight: '100vh' }}>
      <div className='container py-4'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h2>🎬 Hindi Movie Explorer</h2>
          <button
            className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <form onSubmit={handleSearch} className='d-flex mb-4 gap-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Search for movies...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type='submit' className='btn btn-primary'>
            Search
          </button>
        </form>

        {loading ? (
          <div className='text-center'>
            <div className='spinner-border text-primary' role='status'></div>
          </div>
        ) : (
          <>
            <div className='row'>
              {paginatedMovies.map((movie) => (
                <div key={movie.imdbID} className='col-md-3 mb-4'>
                  <div
                    className='card h-100 shadow'
                    style={{ cursor: 'pointer' }}
                    onClick={() => fetchMovieDetails(movie.imdbID)}
                    data-bs-toggle='modal'
                    data-bs-target='#movieModal'
                  >
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                      className='card-img-top'
                      alt={movie.Title}
                      style={{ height: '400px', objectFit: 'fill' }}
                    />
                    <div className='card-body'>
                      <h5 className='card-title'>{movie.Title}</h5>
                      <p className='card-text'>📅 {movie.Year}</p>
                      <a
                        href={`https://www.imdb.com/title/${movie.imdbID}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btn btn-sm btn-outline-primary'
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on IMDb
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {movies.length > moviesPerPage && (
              <div className='d-flex justify-content-between align-items-center mt-4'>
                <button className='btn btn-secondary' disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  ◀ Prev
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button className='btn btn-secondary' disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
        {error && (
          <div className='alert alert-danger text-center' role='alert'>
            {error}
          </div>
        )}

        {/* Modal */}
        <div className='modal fade' id='movieModal' tabIndex='-1' aria-hidden='true'>
          <div className='modal-dialog modal-lg modal-dialog-centered'>
            <div className='modal-content'>
              {selectedMovie ? (
                <>
                  <div className='modal-header'>
                    <h5 className='modal-title'>{selectedMovie.Title}</h5>
                    <button type='button' className='btn-close' data-bs-dismiss='modal'></button>
                  </div>
                  <div className='modal-body row'>
                    <div className='col-md-5'>
                      <img
                        src={
                          selectedMovie.Poster !== 'N/A'
                            ? selectedMovie.Poster
                            : 'https://via.placeholder.com/300x450?text=No+Image'
                        }
                        alt={selectedMovie.Title}
                        className='img-fluid rounded'
                      />
                    </div>
                    <div className='col-md-7'>
                      <p>
                        <strong>Year:</strong> {selectedMovie.Year}
                      </p>
                      <p>
                        <strong>Genre:</strong> {selectedMovie.Genre}
                      </p>
                      <p>
                        <strong>Plot:</strong> {selectedMovie.Plot}
                      </p>
                      <p>
                        <strong>Actors:</strong> {selectedMovie.Actors}
                      </p>
                      <p>
                        <strong>IMDB Rating:</strong> ⭐ {selectedMovie.imdbRating}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className='modal-body text-center p-5'>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
