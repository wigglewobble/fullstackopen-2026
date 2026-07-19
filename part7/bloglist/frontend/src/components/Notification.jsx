import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const message = useNotificationStore(state => state.message)

  if (!message) return null

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default Notification