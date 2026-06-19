import useStore from '../store'

const Statistics = () => {
  const good = useStore((state) => state.good)
  const neutral = useStore((state) => state.neutral)
  const bad = useStore((state) => state.bad)

  const all = good + neutral + bad

  if (all === 0) {
    return <div>No feedback given</div>
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {all}</div>
      <div>average {average}</div>
      <div>positive {positive} %</div>
    </div>
  )
}

export default Statistics