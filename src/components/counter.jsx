import React, { useState, useEffect } from 'react'

const Counter = ({ className, targetValue, duration }) => {
  const [currentValue, setCurrentValue] = useState(0)

  const amountPerMS = targetValue / duration

  function precise (x) {
    return Number.parseFloat(x).toFixed(0)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue(prevValue => {
        if (prevValue >= targetValue || duration == 0) {
          clearInterval(interval)
          return targetValue
          // return 0;
        }
        return prevValue + 10 * amountPerMS
      })
    }, 10)
    return () => clearInterval(interval)
  }, [targetValue])

  return <span className={`font-bold ${className}`}>{precise(currentValue)}</span>
}

export default Counter
