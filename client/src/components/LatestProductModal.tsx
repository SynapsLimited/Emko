import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import './../css/latestproductmodal.css'

interface LatestProduct {
  _id: string
  name: string
  name_en?: string
  slug: string
  images: string[]
  variations: string[]
  variations_en?: string[]
  description: string
  description_en?: string
  colors?: { hex: string }[]
  createdAt: string
}

interface LatestProductModalProps {
  isOpen: boolean
  onClose: () => void
}

const LatestProductModal: React.FC<LatestProductModalProps> = ({ isOpen, onClose }) => {
  const [latestProducts, setLatestProducts] = useState<LatestProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || 'en'
  const modalRef = useRef<HTMLDivElement>(null)

  const truncateDescription = (text: string, wordLimit: number): string => {
    const words = text.split(' ')
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'
    }
    return text
  }

  useEffect(() => {
    if (!isOpen) return

    const fetchLatestProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`)
        const data: LatestProduct[] = await response.json()

        if (Array.isArray(data)) {
          const sortedProducts = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          const latestTen = sortedProducts.slice(0, 10)
          setLatestProducts(latestTen)
        } else {
          console.error('Fetched products is not an array:', data)
          setLatestProducts([])
        }
      } catch (error) {
        console.error('Error fetching latest products:', error)
        setLatestProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestProducts()
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 id="modal-title" className="text-2xl font-bold">Latest Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading
              ? Array(6).fill(0).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-lg"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))
              : latestProducts.map((product) => {
                  const name = currentLanguage === 'en' ? product.name_en || product.name : product.name
                  const description = currentLanguage === 'en' ? product.description_en || product.description : product.description
                  const variations = currentLanguage === 'en' ? product.variations_en || product.variations : product.variations

                  return (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg product-card">
                      <div className="aspect-w-16 aspect-h-9">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{name}</h3>
                        {variations.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">{variations.join(', ')}</p>
                        )}
                        <p className="text-sm text-gray-700 mb-4">{truncateDescription(description, 15)}</p>
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex space-x-2 mb-4">
                            {product.colors.slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border border-gray-300 color-circle"
                                style={{ backgroundColor: color.hex }}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 color-circle">
                                +{product.colors.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                        <Link
                          to={`/products/${product.slug}`}
                          className="block w-full text-center bg-primary hover:bg-primary text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestProductModal

