'use client'

const Spinner = () => {
  return (
    <div class='flex'>
      <div class='relative h-64 flex items-center'>
        <div class='w-12 h-12 rounded-full absoluteborder-4 border-solid border-gray-200' />
        <div class='w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-900 border-t-transparent shadow-md' />
      </div>
    </div>
  )
}

export default Spinner
