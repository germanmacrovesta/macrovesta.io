import { Select, Chip, SelectItem, Card, CardBody } from '@nextui-org/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import Image from 'next/image'
import { PRODUCT_CATEGORIES } from '~/constants/constants'
import type { Product } from '@prisma/client'

const ExclusiveForYou: React.FC<{ exclusiveForYouProducts: Product[] }> = ({ exclusiveForYouProducts }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <div className='bg-slate-50 flex flex-col mx-12 p-6 mt-5 rounded-md shadow-md overflow-hidden'>
      <div className='flex w-full flex-col self-start'>
        <div className='md:flex justify-between items-center mb-6'>
          <h1 className='relative inline-block text-3xl -z-0 italic align-baseline'>
            Exclusive for you
            <span className='absolute -z-10 left-2 -bottom-1 w-full h-[20%] bg-gradient-to-r from-transparent via-transparent to-green-400' />
          </h1>
          <div className='flex justify-between md:justify-end items-center md:w-[50%]'>
            <Select
              radius='md'
              label='Category'
              className='w-[50%]'
              size='sm'
              placeholder='Default: Cotton'
              variant='underlined'
              defaultSelectedKeys={['cotton']}
            >
              {PRODUCT_CATEGORIES.map((option) => (
                <SelectItem key={option.parameter} value={option.parameter}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {loading
          ? (
            <div className='grid md:grid-cols-4 gap-4 animate-fade-right'>
              {exclusiveForYouProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id} className=''
                >
                  <Card className='p-0 rounded-md hover:scale-[102%] 3xl:h-[550px] md:h-[500px] h-[300px] relative' href={`/product/${product.id}`} as={Link}>
                    <CardBody className=' flex flex-col justify-between h-52 p-0 overflow-hidden z-0'>
                      <div className='flex flex-col justify-between py-1 px-2 gap-4 relative'>
                        <h4 className=' text-large text-white italic whitespace-nowrap truncate uppercase text-center'>{product.name}
                          <div className='bg-black absolute left-0 -top-1 w-full h-[50%] bg-opacity-70 -z-10' />
                        </h4>
                        <Chip
                          className={`${product.category === 'waste' ? 'from-indigo-700 via-purple-700 to-transparent to-90%' : 'from-lime-700 via-green-700 to-transparent to-90%'} bg-transparent bg-gradient-to-r font-black pr-10 italic rounded-md uppercase text-small text-white`}
                        >
                          {product.category}
                        </Chip>
                      </div>

                      {/* Gradient layer */}
                      <div className='flex flex-col justify-between absolute w-full h-full -z-10 '>
                        <div className='' />
                        <div className='bg-gradient-to-t from-black to-transparent w-full h-[25%] opacity-90 ' />
                      </div>

                      <Image
                        alt='Card background'
                        className='absolute -z-20 '
                        src={`/product-mock-${index}.jpeg`}
                        fill
                        sizes='(max-width: 768px) 100vw'
                        style={{ objectFit: 'cover' }}
                      />

                      <div className='flex justify-between items-center p-2'>
                        <div className='mt-auto'>
                          <div className='flex flex-col gap-2'>
                            <Chip
                              startContent={
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5 text-white'>
                                  <path d='M2 4.5A2.5 2.5 0 014.5 2h11a2.5 2.5 0 010 5h-11A2.5 2.5 0 012 4.5zM2.75 9.083a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 12.663a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 16.25a.75.75 0 000 1.5h14.5a.75.75 0 100-1.5H2.75z' />
                                </svg>
                              }
                              color=''
                            >
                              <p className='truncate text-white'>
                                {product.quantity} Tonnes
                              </p>
                            </Chip>
                            {/* <Chip
                          className=''
                          startContent={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                            <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                          </svg>
                          }
                          color=''
                        >
                          <p className='max-w-[100px] text-white overflow-hidden truncate'>
                            {product.quality}
                          </p>
                        </Chip> */}
                          </div>
                        </div>
                        <h1 className='text-white mt-auto text-4xl bg-gradient-to-br rounded-md italic uppercase whitespace-nowrap '>
                          {product.price_usd}
                          <span className='text-xs'>
                            $ on CTZ23
                          </span>
                        </h1>

                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          )
          : (
            <div className='flex justify-center md:h-[500px] h-[300px] pt-10'>
              <Spinner />
            </div>
          )}
      </div>
    </div>
  )
}

export default ExclusiveForYou
