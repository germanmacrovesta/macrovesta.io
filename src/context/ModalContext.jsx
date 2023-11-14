import { createContext, useContext, useState } from 'react'

const CustomModalContext = createContext()

export const useCustomModal = () => {
  return useContext(CustomModalContext)
}

export const CustomModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null)
  const [modalSection, setModalSection] = useState(null)
  const [modalData, setModalData] = useState(null)

  // Atributes required for generate modal
  const openModal = (type, section, data) => {
    setModalType(type)
    setModalSection(section)
    setModalData(data)
  }

  const closeModal = () => {
    setModalType(null)
    setModalSection(null)
    setModalData(null)
  }

  function obtainCustomKeys (modalSection) {
    let objectShape
    console.log(modalSection)
    switch (modalSection) {
      case 'In Country News':
        objectShape = {
          title: '',
          text: '',
          impact: '',
          country: ''
        }
        return objectShape
      case 'Recent Events':
        objectShape = {
          title: '',
          text: '',
          impact: '',
          news_type: modalSection
        }
        return objectShape
      case 'Future Considerations':
        objectShape = {
          title: '',
          text: '',
          impact: '',
          news_type: ''
        }
        return objectShape
      case 'Add Product':
        objectShape = {
          product: '',
          category: '',
          quantity: '',
          description: '',
          price_usd: '',
          quality: '',
          shipment: '',
          hvi_file: '',
          payment_terms: '',
          agents: [],
          buyers: [],
          expiry_date: ''
        }
        return objectShape
      default:
        console.log(modalSection)
        break
    }
  }

  function obtainEndPoint (modalSection) {
    let endpoint
    switch (modalSection) {
      case 'In Country News':
        endpoint = '/api/add-country-news'
        return endpoint
      case 'Recent Events':
      case 'Future Considerations':
        endpoint = '/api/add-snapshot'
        return endpoint
      case 'Add Product':
      case 'Edit Product':
        endpoint = '/api/product'
        return endpoint
      default:
        console.log(modalSection)
        break
    }
  }

  function obtainMethod (modalSection) {
    let method
    switch (modalSection) {
      case 'In Country News':
      case 'Recent Events':
      case 'Future Considerations':
        method = 'POST'
        return method
      case 'Add Product':
        method = 'POST'
        return method
      case 'Edit Product':
        method = 'PUT'
        return method
      default:
        console.log(modalSection)
        break
    }
  }

  return (
    <CustomModalContext.Provider
      value={{ modalType, modalSection, modalData, openModal, closeModal, obtainMethod, obtainEndPoint, obtainCustomKeys }}
    >
      {children}
    </CustomModalContext.Provider>
  )
}
