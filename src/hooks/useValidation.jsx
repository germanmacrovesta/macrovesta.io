import { useEffect, useState } from 'react'

/*
  Hook made for mostly for validate all data before sendRequest to the server.
  Depends on the object, validate the diferent fields.
*/

const useValidate = (object) => {
  const [validationAlert, setValidationAlert] = useState({}) // Show alerts
  const [objectToValidate, setObjectToValidate] = useState(object) // Object To validate

  const [startValidation, setStartValidation] = useState(false) // Start validation
  const [objectIsValid, setObjectIsValid] = useState(false) // Object is OK!

  useEffect(() => {
    // Validation Logic
    // Validate all Fields are correctly filled
    if (startValidation && objectToValidate) {
      if (Object.values(objectToValidate).includes('')) { // Check all fields are filled
        setValidationAlert({ msg: 'All fields are required.', error: true })
        setStartValidation(false)
        return
      }

      // Clear alert, Valid OK, Go to send
      setValidationAlert({})
      setStartValidation(false)
      setObjectIsValid(true)
    }
  }, [startValidation, objectIsValid])

  return (
    { validationAlert, setValidationAlert, setStartValidation, objectIsValid, setObjectIsValid, objectToValidate, setObjectToValidate }
  )
}

export default useValidate
