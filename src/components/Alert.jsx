const Alert = ({ alert }) => {
  return (
    <>
      <div className={`${alert.error ? 'text-red-800 dark:text-red-400 bg-red-100 dark:bg-slate-700' : 'text-green-800 dark:text-green-400 bg-green-100 dark:bg-slate-700'} text-center rounded-lg mx-auto p-2 mb-4 text-sm animate-fade`} role='alert'>
        <svg aria-hidden='true' className='flex-shrink-0 inline w-6 h-6 mr-3' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' /></svg>
        {alert.msg}
      </div>
    </>
  )
}

export default Alert
