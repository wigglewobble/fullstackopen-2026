const CountryList = ({ countries, handleShow }) => {
  return (
    <div>
      {countries.map(c => (
        <p key={c.cca3}>
          {c.name.common}
          <button onClick={() => handleShow(c)}>show</button>
        </p>
      ))}
    </div>
  )
}

export default CountryList