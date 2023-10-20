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

  return (
    <CustomModalContext.Provider
      value={{ modalType, modalSection, modalData, openModal, closeModal }}
    >
      {children}
    </CustomModalContext.Provider>
  )
}
