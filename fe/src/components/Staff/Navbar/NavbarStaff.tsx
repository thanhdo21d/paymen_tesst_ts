import { Avatar, Button, Col, Row } from 'antd'
import { BiLogOut, BiSolidSun } from 'react-icons/bi'
import { FaMoon } from 'react-icons/fa'
import { useLogoutMutation } from '../../../api/Auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
const NavbarStaff = () => {
  const [logout] = useLogoutMutation()
  const onLogout = () => {
    logout().then(() => {
      window.location.href = '/'
    })
  }
  const [isDarkMode, setIsDarkmode] = useState(false)
  const toggleDarkMode = () => {
    setIsDarkmode((prevMode) => !prevMode)
  }
  return (
    <>
      <Row justify='space-around' align='middle'>
        <Col span={15}>
          {/* <Search
                                className='bg-blue-500 mt-[10px] ml=[-50px]'
                                placeholder="input search text"
                                allowClear
                                enterButton="Search"
                                size="large"
                                onSearch={onSearch}
                            /> */}
        </Col>
        <div>
          <Avatar style={{ backgroundColor: '#f56a00', marginRight: '10px' }}>DH</Avatar>
          <Link to={'#'}>Dang Quang Huy</Link>
        </div>
        <Button className='font-bold' onClick={toggleDarkMode}>
          {isDarkMode ? <BiSolidSun /> : <FaMoon />}
        </Button>
        <Button className='bg-green-400 text-xl font-bold  ml-[-80px]' onClick={onLogout}>
          <BiLogOut style={{ transform: 'rotate(180deg)' }} />
        </Button>
      </Row>
    </>
  )
}

export default NavbarStaff
