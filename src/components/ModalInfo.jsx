import { useEffect, useState } from 'react'
import Spinner from './Spinner'

const ModalInfo = ({ modalSection, handleChange, handleSubmit, modalData }) => {
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(true)

  // SHOW INTERFACE PRODUCT DATA
  useEffect(() => {
    async function getProductInfo () {
      try {
        const response = await fetch(`/api/get-product?id=${modalData}`)
        const product = await response.json()
        setProduct(product)
      } catch (error) {
        console.log(error)
      }
    }

    if (modalSection === 'Info Product') {
      getProductInfo()
    }
  }, [])

  useEffect(() => {
    if (Object.keys(product).length > 0) {
      setLoading(false)
    }
  }, [product])

  if (loading) {
    return (
      <div className='flex justify-center'>
        <Spinner />
      </div>
    )
  }

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
          <p className='font-bold'>Product Name:</p>
          <p>{product.product}</p>
          <p className='font-bold'>Category</p>
          <p>{product.category}</p>
          <p className='font-bold'>Quantity</p>
          <p>{product.quantity}</p>
          <p className='font-bold'>Quality:</p>
          <p>{product.quality}</p>
          <p className='font-bold'>Image url</p>
          <p>{product.image_url}</p>
          <p className='font-bold'>Price:</p>
          <p>{product.price_usd}</p>
          <p className='font-bold'>Hvi file name:</p>
          <p>{product.hvi_file}</p>
          <p className='font-bold'>Shipment:</p>
          <p>{product.shipment}</p>
          <p className='font-bold'>Payment terms:</p>
          <p>{product.payment_terms}</p>
          <p className='font-bold'>OFFERED TO:</p>
          {product?.buyers?.map(buyer => (
            <p key={buyer.buyer.email}>{buyer.buyer.name},{buyer.buyer.email}</p>
          ))}
          <p className='font-bold'>RELATED AGENTS:</p>
          {product?.agents?.map(agent => (
            <p key={agent.agent.email}>{agent.agent.name},{agent.agent.email}</p>
          ))}
        </div>
      )}
    </>
  )
}

export default ModalInfo
