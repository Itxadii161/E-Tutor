import {Link} from 'react-router-dom'
const NavMenu = () => {
    const navItem = [
     {  
        id: '1',
        name: 'Home',
        link: '/'
     },
     {  
        id: '2',
        name: 'Find a Tutor',
        link: '/'
     },
     {  
        id: '3',
        name: 'Become a Tutor',
        link: '/become-tutor-form'
     },
     {  
        id: '4',
        name: 'Resources',
        link: '/'
     },
     {  
        id: '5',
        name: 'How it Work',
        link: '/'
     },
     {  
        id: '6',
        name: 'About Us',
        link: '/'
     },
    ]

    return(
        <div className='sticky top-0 z-50'>
            <ul className='bg-black text-white font-semibold text-lg flex h-12 gap-10 items-center sticky top-0 '>
                {navItem.map((items, index) => (
                    <li key={items.id}
                    className=' ml-10'>
                        <Link to={items.link}>{items.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default NavMenu;