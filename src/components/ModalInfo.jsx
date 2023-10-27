import { useEffect, useState } from 'react'

const ModalInfo = ({ modalSection, handleChange, handleSubmit, modalData }) => {
  const [product, setProduct] = useState({})
  //TODO: SHOW INTERFACE PRODUCT DATA
  useEffect(() => {
    async function getProductInfo () {
      try {
        console.log(modalData)
        const response = await fetch(`/api/get-product?id=${modalData}`)
        console.log(response)
        const product = await response.json()
        console.log(product)
        setProduct(product)
      } catch (error) {
        console.log(error)
      }
    }

    if (modalSection === 'Info Product') {
      getProductInfo()
    }
  }, [])

  return (
    <>
      {modalSection === 'Recent Events' && (
        <div className='flex flex-col items-center justify-center'>
          <p>RecentEventsData</p>
        </div>
      )}

      {modalSection === 'Future Considerations' && (
        <div className='flex flex-col items-center justify-center'>
          <p>Future Considerations Data</p>
        </div>
      )}

      {modalSection === 'In Country News' && (
        <div className='flex flex-col items-center justify-center'>
          <p>In Country News Data</p>
        </div>
      )}

      {modalSection === 'Info Product' && (
        <div className='flex flex-col items-center justify-center'>
          <p>Product Data</p>
        </div>
      )}
    </>
  )
}

export default ModalInfo
