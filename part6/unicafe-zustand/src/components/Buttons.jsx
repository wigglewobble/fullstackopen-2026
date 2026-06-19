import useStore from '../store'

const Buttons = () => {
  const increaseGood = useStore((state) => state.increaseGood)
  const increaseNeutral = useStore((state) => state.increaseNeutral)
  const increaseBad = useStore((state) => state.increaseBad)

  return (
    <>
      <button onClick={increaseGood}>good</button>
      <button onClick={increaseNeutral}>neutral</button>
      <button onClick={increaseBad}>bad</button>
    </>
  )
}

export default Buttons