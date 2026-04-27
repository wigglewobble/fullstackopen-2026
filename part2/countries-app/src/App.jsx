import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <h2>Find countries</h2>

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setSelectedCountry(null)
        }}
      />

      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : filtered.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filtered.length > 1 ? (
        <CountryList countries={filtered} handleShow={handleShow} />
      ) : filtered.length === 1 ? (
        <CountryDetail country={filtered[0]} />
      ) : (
        <p>No matches</p>
      )}
    </div>
  )
}

export default App