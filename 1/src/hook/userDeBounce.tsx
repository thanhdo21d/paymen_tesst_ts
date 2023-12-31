import { useEffect, useState } from 'react'

const useDeBounce = (value: any, delay = 500, saveValue?: string) => {
  const [debounce, setDebounce] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounce(value || saveValue)
    }, delay)
    return () => {
      clearTimeout(id)
    }
  }, [value, delay])

  return debounce
}

export default useDeBounce
