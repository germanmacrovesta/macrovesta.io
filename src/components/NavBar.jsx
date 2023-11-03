import { useRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Chip, Badge } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import SingleSelectDropdown from './singleSelectDropdown'
import FormSubmit from './formSubmit'

export default function NavBar (session) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [newVenue, setNewVenue] = useState(null)
  const [venueArray, setVenueArray] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState(null)

  const router = useRouter()
  const urlPath = router.asPath
  const splitPath = urlPath.split('/')
  const root = '/' + splitPath[1] + '/' + splitPath[2] + '/' + splitPath[3]
  let active = []
  if (splitPath.length >= 4) {
    active = ['/' + splitPath[splitPath.length - 1], '/' + splitPath[splitPath.length - 2], '/' + splitPath[splitPath.length - 3], '/' + splitPath[splitPath.length - 4]]
  } else if (splitPath.length >= 3) {
    active = ['/' + splitPath[splitPath.length - 1], '/' + splitPath[splitPath.length - 2], '/' + splitPath[splitPath.length - 3], '/' + splitPath[splitPath.length - 3]]
  }

  const [openBugForm, setOpenBugForm] = useState(false)

  const [selectedBugType, setSelectedBugType] = useState('')

  const [bugError_Message, setBugError_Message] = useState('')
  const [bugSubmitted, setBugSubmitted] = useState(false)
  const [bugSubmitting, setBugSubmitting] = useState(false)
  const [bugWarning_Message, setBugWarning_Message] = useState('')
  const [bugWarningSubmit, setBugWarningSubmit] = useState(false)

  const handleBugFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setBugSubmitting(true)

    let bug_type = ''
    const title = e.target.title.value
    const text = e.target.text.value
    // let image = e.target["image"].value;
    let errorMessage = ''
    const warningMessage = ''

    // console.log("textarea", text == "")

    if (selectedBugType != null && selectedBugType != '' && selectedBugType != 'Select Bug Type') {
      bug_type = selectedBugType
    } else {
      errorMessage += 'Please select a bug type. '
    }
    if (title == null || title == '') {
      errorMessage += 'Please enter a title. '
    }
    if (text == null || text == '') {
      errorMessage += 'Please enter a text. '
    }

    if (errorMessage != '') {
      setBugError_Message(errorMessage)
      setBugWarningSubmit(false)
      setBugSubmitting(false)
    } else {
      if (bugError_Message != '') {
        setBugError_Message('')
      }

      if (bugWarningSubmit == false && warningMessage != '') {
        setBugWarningSubmit(true)
        setBugSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          title,
          text,
          user: session?.user?.name,
          bug_type
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-bug-report'

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json'
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json().then(() => { setBugSubmitted(true); setBugSubmitting(false) })
        // setSnapshotSubmitted(true); setSnapshotSubmitting(false)
      }
    }
  }

  const menuItems = [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'Improvements',
      href: '/improvements'
    },
    {
      name: 'Position',
      href: '/position'
    },
    {
      name: 'MarketPlace',
      href: '/marketplace'
    }
  ]
  console.log(session)
  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth='full'
        className='px-8'
      >
        {/* Mobile Menu */}
        <NavbarContent className='sm:hidden' justify='start'>
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarContent className='sm:hidden pr-3' justify='center'>
          <NavbarBrand className='w-[125px] h-[125px]'>
            <img src='/Logo File-13.png' alt='' />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className='hidden sm:flex max-w-full relative' justify='center'>

          <NavbarItem className='relative'>
            <Link className='w-[32px] h-[32px]' href='/'>
              <img src='/logo-small.png' alt='' className='hover:cursor-pointer' />
            </Link>
          </NavbarItem>

          <NavbarItem className='relative px-4'>
            <Link href='/improvements' className='text-black'>
              Improvements
            </Link>
          </NavbarItem>

          <NavbarItem className='relative px-4'>
            <Badge
              content='&#9733;'
              color='danger'
              size='sm'
              className='absolute -top-1 right-0 bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white shadow-pink-500/30'
            >
              <Link href='/position' className='text-black relative'>
                Position
              </Link>
            </Badge>
          </NavbarItem>

          <div class='group inline-block relative'>
            <NavbarItem
              class='rounded items-center'
            >
              <Badge
                content='&#9733;'
                color='danger'
                size='sm'
                className='absolute -top-1 right-0 bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white shadow-pink-500/30'
              >

                <div className='text-black relative hover:cursor-pointer px-4 '>
                  <Link href='/marketplace' className='mr-1 text-black'>Marketplace</Link>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4 absolute right-0 top-1'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                  </svg>
                </div>

              </Badge>
            </NavbarItem>
            <ul class='absolute hidden pt-1 group-hover:block '>
              <li class='rounded-b flex items-center bg-[#f5f8fc] py-4 px-4 animate-flip-down'>
                <Link
                  className='whitespace-nowrap text-black hover:text-purple-700'
                  href='/marketplace-seller-panel'
                >
                  Seller panel
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6 ml-2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </NavbarContent>

        <NavbarContent justify='end'>
          <NavbarItem>
            <Badge content='4' shape='circle' color='danger'>
              <Button
                radius='full'
                isIconOnly
                aria-label='more than 99 notifications'
                variant='light'
                as={Link}
                href='/my-notifications'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                  <path fillRule='evenodd' d='M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z' clipRule='evenodd' />
                </svg>
              </Button>
            </Badge>
          </NavbarItem>
          <NavbarItem className='hidden sm:inline'>
            <Button as={Link} color='success' className='hidden sm:flex ' href='/my-dashboard' variant='flat'>
              My Dashboard
            </Button>
          </NavbarItem>
          <NavbarItem className='hidden md:inline'>
            <Button as={Link} color='success' className='hidden sm:flex' href='/overview' variant='flat'>
              Overview
            </Button>
          </NavbarItem>
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <Avatar
                name={session?.user?.name}
                as='button'
                className='transition-transform'
                size='md'
                src='https://avatars.githubusercontent.com/u/147153463?s=400&u=625dac0b6d0314523830b5a4c4b16ff0e17a3d92&v=4'
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='Profile Actions' variant='flat'>
              <DropdownItem key='profile' className='h-14 gap-2'>
                <p className='font-semibold'>{session.session?.user.name}</p>
                <p className='font-semibold'>{session.session?.user.email}</p>
                <p className='font-semibold'>Role: {session.session?.role} </p>
              </DropdownItem>
              <DropdownItem key='settings'>
                <Link className='text-black' href='/system-preferences'>
                  Preferences ⚙️
                </Link>
              </DropdownItem>
              <DropdownItem key='Report a bug' onClick={() => setOpenBugForm(true)}>
                Report a bug 🐛
              </DropdownItem>
              <DropdownItem key='logout' color='danger'>
                Log Out 🚪⬅️
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        {/* <div className={`${urlPath === '/improvements' ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
        <Link href={{ pathname: '/improvements' }}>
          IMPROVEMENTS
        </Link>
      </div>
      {(session?.tier === 'premium' || session?.type === 'owner') && (
        <Link href={{ pathname: '/position' }}>
          POSITION
        </Link>
      )}
      {session?.access_to_marketplace === true && (
        <Link href={{ pathname: '/marketplace' }}>
          MARKETPLACE
        </Link>
      )}
      {session?.role === 'admin' && (
        <Link href={{ pathname: '/system-preferences' }}>
          PREFERENCES
        </Link>
      )} */}

        {/* Mobile Menu */}
        <NavbarMenu className='flex flex-col justify-center items-center'>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className='w-full'
                color='foreground'
                href={item.href}
                size='lg'
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link color='foreground' className='w-full' size='lg' href='/my-dashboard'>
              My Dashboard
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem className=''>
            <Link color='foreground' className='w-full' size='lg' href='/overview'>
              Overview
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
      {openBugForm && (
        <>
          <div className='absolute modal left-0 top-0 z-50'>
            <div className=' fixed grid place-content-center inset-0 z-40'>
              <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                <div className='my-4 font-semibold text-lg'>
                  Add Bug Report
                </div>
                <div className='w-full'>
                  <form className='mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full' onSubmit={handleBugFormSubmit}>
                    <div className='mb-4'>
                      <div className='mb-4'>
                        <SingleSelectDropdown
                          options={[{ name: 'Visual', value: 'Visual' }, { name: 'Functionality', value: 'Functionality' }, { name: 'Other', value: 'Other' }]}
                          label='bug_type'
                          variable='name'
                          colour='bg-deep_blue'
                          onSelectionChange={(e) => setSelectedBugType(e.value)}
                          placeholder='Select Bug Type'
                          searchPlaceholder='Search Types'
                          includeLabel={false}
                        />
                      </div>
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='title'
                        className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                      >
                        Title
                      </label>
                      <input
                        type='text'
                        id='title'
                        className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                        placeholder='Enter title'
                      />
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='text'
                        className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                      >
                        Bug
                      </label>
                      <textarea id='text' placeholder='Enter text' name='text' rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
                    </div>

                    <div className='col-span-2 flex justify-center'>
                      <FormSubmit errorMessage={bugError_Message} warningMessage={bugWarning_Message} submitted={bugSubmitted} submitting={bugSubmitting} warningSubmit={bugWarningSubmit} />
                    </div>
                  </form>
                </div>
              </div>
              <div onClick={() => setOpenBugForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-40' />
            </div>
          </div>
        </>
      )}
    </>
  )
}
