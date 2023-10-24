import { useRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Chip, Badge } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import SingleSelectDropdown from './singleSelectDropdown'
import FormSubmit from './formSubmit'

export default function NavBar (props) {
  const { data: session } = useSession()
  const urlcrumbs = props.urlPath.split('/')
  const textcrumbs = props.urlPath.replace('-', ' ').split('/')

  textcrumbs.shift()
  urlcrumbs.shift()

  function partialURL (index) {
    let url = props.root + '/'
    for (let i = 0; i <= index; i++) {
      url += urlcrumbs[i]
      url += '/'
    }
    console.log(url)
    return url
  }

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

  const activeVenue = 'ApplePop'

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
    // if (image == null || image == "") {
    //     warningMessage += "You can add an image as well. If you don't want to just click confirm. ";
    // }

    // if (warningMessage !== "") {
    //     setBugWarning_Message(warningMessage);
    //     // throw new Error(errorMessage)
    // } else {
    //     if (bugWarning_Message != "") {
    //         setBugWarning_Message("")
    //     }
    // }

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

        <NavbarContent className='hidden sm:flex gap-4 max-w-full relative' justify='center'>

          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`} className='relative'>
              {item.name === 'Home'
                ? (
                  <Link className='w-[32px] h-[32px]' href='/'>
                    <img src='/logo-small.png' alt='' className='hover:cursor-pointer' />
                  </Link>
                  )
                : item.name === 'Improvements'
                  ? (
                    <Link href={item.href} className='text-black relative'>
                      {item.name}
                    </Link>
                    )
                  : (
                    <Badge
                      content='&#9733;' color='danger' size='sm' className='absolute -top-1 right-0 bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white shadow-pink-500/30'
                    >
                      <Link href={item.href} className='text-black relative'>
                        {item.name}
                      </Link>
                    </Badge>
                    )}
            </NavbarItem>
          ))}
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className='p-0 bg-transparent data-[hover=true]:bg-transparent'
                  radius='sm'
                  variant='light'
                >
                  Features
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label='ACME features'
              className='w-[340px]'
              itemClasses={{
                base: 'gap-4'
              }}
            >
              <DropdownItem
                key='autoscaling'
                description='ACME scales apps to meet user demand, automagically, based on load.'

              >
                Autoscaling
              </DropdownItem>
              <DropdownItem
                key='usage_metrics'
                description='Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.'
              >
                Usage Metrics
              </DropdownItem>
              <DropdownItem
                key='production_ready'
                description='ACME runs on ACME, join us and others serving requests at web scale.'
              >
                Production Ready
              </DropdownItem>
              <DropdownItem
                key='99_uptime'
                description='Applications stay on the grid with high availability and high uptime guarantees.'
              >
                +99% Uptime
              </DropdownItem>
              <DropdownItem
                key='supreme_support'
                description='Overcome any challenge with a supporting team ready to respond.'
              >
                +Supreme Support
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
        <NavbarContent justify='end'>
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
                name={session?.user.name}
                as='button'
                className='transition-transform'
                size='md'
                src='https://avatars.githubusercontent.com/u/147153463?s=400&u=625dac0b6d0314523830b5a4c4b16ff0e17a3d92&v=4'
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='Profile Actions' variant='flat'>
              <DropdownItem key='profile' className='h-14 gap-2'>
                <p className='font-semibold'>Signed in as</p>
                <p className='font-semibold'>senpudev@gmail.com</p>
                <p className='font-semibold'>Role: User </p>
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
