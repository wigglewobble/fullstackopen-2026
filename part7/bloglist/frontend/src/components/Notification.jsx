import Alert from '@mui/material/Alert'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return <Alert severity="info">{message}</Alert>
}

export default Notification
