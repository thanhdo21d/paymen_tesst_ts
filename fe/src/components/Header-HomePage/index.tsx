import { FaBars, FaSearch, FaTimes } from 'react-icons/fa'
import { useEffect, useRef } from 'react'

import { Auth } from '../../api/Auth'
import { Link } from 'react-router-dom'
import { AiOutlineArrowDown } from 'react-icons/ai'

const HeaderHomePage = () => {
  const [fetchUser] = Auth.endpoints.fetchUser.useLazyQuery()
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const toggleMenu = () => {
    menuRef.current?.classList.toggle('show__menu')
    overlayRef.current?.classList.toggle('hidden')
  }

  return (
    <header className='w-full absolute z-[99] py-3 px-5 md:px-10 lg:px-0 '>
      <div className='container my-0 mx-auto flex items-center justify-between '>
        <div className='left flex items-center '>
          <Link to='/' className='self-start'>
            <img className='w-[56px] max-w-[56px] md:w-[56px] md:max-w-[56px]' src='/logo_removebg.png' alt='' />
          </Link>
        </div>
        <div className='middle'>
          <nav ref={menuRef} className='menu md:hidden md:static lg:block ml-[30px] text-white '>
            <div
              className='btn-close flex items-center justify-end mt-4 mb-6 pr-8 md:hidden uppercase text-sm font-semibold cursor-pointer'
              onClick={toggleMenu}
            >
              <span> Đóng </span>
              <FaTimes />
            </div>
            <ul className='flex flex-col mx-10 lg:mx-0 lg:flex-row justify-center  gap-x-5 uppercase'>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Trang chủ
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <div className='menu_item relative group'>
                  <a href='/about' onClick={toggleMenu} className='flex'>
                    <p className='mr-1 hover:underline'>Giới thiệu</p> <AiOutlineArrowDown />
                  </a>
                  <ul className='sub-menu absolute w-0 hidden bg-gray-800 text-white py-2 px-4 transition duration-300 group-hover:block group-hover:w-[200px] '>
                    <li>
                      <Link to='/about/' className='block py-1 max-w-[500px] hover:text-[#d3b673] hover:underline'>
                        LỊCH SỬ VÀ SỨ MỆNH
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='/achievement/'
                        className='block py-1 max-w-[500px] hover:text-[#d3b673] hover:underline'
                      >
                        THÀNH TỰU ĐẠT ĐƯỢC
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/products' onClick={toggleMenu}>
                  Sản phẩm
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Tin tức
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Cửa hàng
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Tuyển dụng
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Nhượng quyền
                </Link>
              </li>
            </ul>
          </nav>

          {/* Overlay */}
          <div
            ref={overlayRef}
            onClick={toggleMenu}
            className='overlay hidden fixed w-[100vw] h-[100vh] top-0 left-0 z-[1] bg-[#80808080]'
          ></div>
        </div>
        <div className='right '>
          <div className='hidden w-8 h-8 rounded-[50%] md:flex items-center justify-center bg-[#d3b673] text-white'>
            <FaSearch />
          </div>
          <div className='block md:hidden text-white text-2xl cursor-pointer' onClick={toggleMenu}>
            <FaBars />
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderHomePage
