import { useRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
export default function Breadcrumbs (props) {
  // const router = useRouter();
  const { data: session } = useSession()
  const urlcrumbs = props.urlPath.split('/')
  const textcrumbs = props.urlPath.replace('-', ' ').split('/')
  // const newRoot = props.root.split('/', 3);
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

  const menuItems = [
    'Profile',
    'Dashboard',
    'Activity',
    'Analytics',
    'System',
    'Deployments',
    'My Settings',
    'Team Settings',
    'Help & Feedback',
    'Log Out'
  ]

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth='full'
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

      <NavbarContent className='hidden sm:flex gap-4 max-w-full' justify='center'>
        {/* <NavbarBrand className='w-[125px] h-[125px]'>
          <img src='/Logo File-13.png' className='object-fill' alt='' />
        </NavbarBrand> */}
        <NavbarItem>
          <Link color='foreground' href='#'>
            Improvements
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href='#' color='foreground' aria-current='page'>
            Position
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link className='text-deep_blue' href='#'>
            Marketplace
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem>
          <Button as={Link} color='success' className='hidden sm:flex' href='/my-dashboard' variant='flat'>
            My Dashboard
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
            <DropdownItem key='settings'>My Settings</DropdownItem>
            <DropdownItem key='team_settings'>Team Settings</DropdownItem>
            <DropdownItem key='analytics'>Analytics</DropdownItem>
            <DropdownItem key='system'>System</DropdownItem>
            <DropdownItem key='configurations'>Configurations</DropdownItem>
            <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
            <DropdownItem key='logout' color='danger'>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className='w-full'
              color={
              index === 2 ? 'warning' : index === menuItems.length - 1 ? 'danger' : 'foreground'
            }
              href='#'
              size='lg'
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>

  )
}
