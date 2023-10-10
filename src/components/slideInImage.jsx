import React, { useEffect, useState, useRef } from 'react'

const SlideInImage = ({ imageUrl, hasShadow = true }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [animationPlayed, setAnimationPlayed] = useState(false)
  const slideInRef = useRef(null) // Create a ref for this instance of the component

  useEffect(() => {
    const handleScroll = () => {
      if (!slideInRef.current || animationPlayed) return

      const rect = slideInRef.current.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0
      setIsVisible(isVisible)

      // Once the image becomes visible, set animationPlayed to true to prevent it from playing again
      if (isVisible) {
        setAnimationPlayed(true)
      }
    }

    // Use the 'resize' event to update visibility when the user changes screen orientation or size
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll() // Check on mount in case the image is already in view

    // Clean up the event listeners on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [animationPlayed])

  return (
        <div className={`relative ${isVisible ? 'animate-slidein' : 'invisible'}`} ref={slideInRef}>
            <img
                className={`w-full max-w-[100%] rounded-xl ${hasShadow ? 'shadow-xl' : ''}`}
                src={imageUrl}
                alt=""
            />
        </div>
  )
}

export default SlideInImage
