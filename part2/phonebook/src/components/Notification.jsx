const Notification = ({ message, type }) => {
  if (!message) return null

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: '#ddd',
    padding: '10px',
    marginBottom: '10px'
  }

  return <div style={style}>{message}</div>
}

export default Notification