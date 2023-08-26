import { Breadcrumb, Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import StaffSidebar from '../../components/Staff/Sidebar'
import NavbarStaff from '../../components/Staff/Navbar/NavbarStaff'
// const { Search } = Input
// const onSearch = (value: string) => console.log(value)
const { Header, Content, Footer } = Layout
const StaffLayout = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <StaffSidebar />
      <Layout className='site-layout'>
        <Header style={{ padding: 2, background: colorBgContainer }}>
          <NavbarStaff />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Products</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Copyright {new Date().getFullYear()}© TocoToco</Footer>
      </Layout>
    </Layout>
  )
}

export default StaffLayout
