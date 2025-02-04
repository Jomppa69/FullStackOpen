import { useState } from 'react'

const Button = ({onClick, text}) =>  (<button onClick={onClick}>{text}</button>)

const StatisticLine = ({text, value}) => {
  return(
  <tr>
    <td>
      {text}
    </td>
    <td>
      {value}
    </td>
  </tr>)
    }


    const Statistics = ({good, neutral, bad}) => {
      return(
        <div>
          <h1>statistics</h1>
          <table>
            <tbody>
              <StatisticLine text="good" value={good}/>
              <StatisticLine text="neutral" value={neutral}/>
              <StatisticLine text="bad" value={bad}/>
              <StatisticLine text="average" value={((good - bad) / (good + neutral + bad)).toFixed(1)}/>
              <StatisticLine text="positive" value={(good / (good + neutral + bad) * 100).toFixed(1) + " %"}/>
            </tbody>
          </table>
        </div>
      )
    }



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setFeedback = (type) => {
    switch(type) {
      case "good":
        const totalGood = good + 1
        console.log("good feedback", totalGood)
        setGood(totalGood)
        break
      case "neutral":
        const totalNeutral = neutral + 1
        console.log("neutral feedback", neutral)
        setNeutral(totalNeutral)
        break
      case "bad":
        const totalBad = bad + 1
        console.log("bad feedback", totalBad)
        setBad(totalBad)
        break
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setFeedback("good")} text="good"/>
      <Button onClick={() => setFeedback("neutral")} text="neutral"/>
      <Button onClick={() => setFeedback("bad")} text="bad"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App