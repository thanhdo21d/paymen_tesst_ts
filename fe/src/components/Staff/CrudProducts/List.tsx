import { RiDeleteBin6Fill } from 'react-icons/ri'
import { AiOutlineEdit, AiOutlineSearch, AiFillEye } from 'react-icons/ai'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import type { InputRef } from 'antd'
import { Button, Input, Popconfirm, Space, Table, message } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useDeleteFakeProductMutation, useFetchProductsQuery } from '../../../api/Product'
import { IProduct } from '../../../interfaces/products.type'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'

interface DataType extends IProduct {
  key: string | React.Key | undefined
}

type DataIndex = keyof DataType

const List = () => {
  const { data: productData, isLoading } = useFetchProductsQuery()
  const [removeProduct] = useDeleteFakeProductMutation()
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  // console.log(productData);
  const start = () => {
    setLoading(true)
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 0
  let data: IProduct[] = []
  if (productData && productData.docs) {
    data = productData.docs.map((item: any) => ({
      key: item._id,
      name: item.name,
      images: item.images?.[0]?.url || '',
      description: item.description,
      price: item.price,
      sale: item.sale,
      category: item.category?.name,
      sizes: item.sizes.map((size: any) => ({ name: size.name, price: size.price })),
      toppings: item.toppings,
      is_deleted: item.is_deleted,
      is_active: item.is_active,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }))
  }
  console.log(data)

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<AiOutlineSearch className='text-[15px]' />}
            size='small'
            style={{ width: 90, backgroundColor: 'blue' }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <AiOutlineSearch className='text-[15px]' style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columns: ColumnsType<any> = [
    {
      title: 'INDEX',
      dataIndex: 'stt',
      width: '3%',
      render: (_, __, index) => index + 1
    },
    {
      title: 'PRODUCT NAME',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'IMAGES',
      dataIndex: 'images',
      key: 'images',
      width: '20%',
      render: (image) => <img className='w-[40px]' src={image} alt='product image' />
    },
    {
      title: 'CATEGORY',
      dataIndex: 'category',
      key: 'category',
      width: '12%',
      ...getColumnSearchProps('category')
    },

    {
      title: 'price',
      dataIndex: 'sale',
      key: 'sale',
      width: '20%',
      ...getColumnSearchProps('images'),
      sorter: (a, b) => {
        const saleA = a.sale || 0
        const saleB = b.sale || 0
        return saleA - saleB
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'ACTION',
      key: 'action',
      width: '20%',
      render: (record) => (
        <Space size='middle'>
          <Button style={{ backgroundColor: '#d46b08', height: '40px' }}>
            <Link style={{ color: 'white', margin: 'auto' }} to={`#`}>
              <AiFillEye className='mr-1 text-lg' />
            </Link>
          </Button>
          <Button style={{ backgroundColor: '#0958d9', height: '40px' }}>
            <Link style={{ color: 'white', margin: 'auto' }} to={`${record.key}/update`}>
              <AiOutlineEdit className='mr-1 text-lg' />
            </Link>
          </Button>
          <Popconfirm
            title='Are you fucking sure?'
            onConfirm={async () => {
              // await pause(1000)
              await removeProduct(record.key)
              message.success('Xóa sản phẩm thành công')
            }}
            okText='Yes'
            okButtonProps={{
              style: { backgroundColor: 'blue' }
            }}
            cancelText='No'
          >
            <Button style={{ backgroundColor: '#f5222d', color: 'white', height: '40px' }}>
              <RiDeleteBin6Fill className='text-lg' />
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  // console.log(productData);

  return (
    <>
      <div className='grid grid-cols-[4fr,1fr]'>
        <h2 className='font-bold text-[30px]'>All products</h2>
        <Button className='bg-[#1677ff] text-[#ffffff] max-w-[150px] font-bold text-[15px] h-10 hover:bg-blue-300 '>
          + Add product
        </Button>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div>
          <div>
            <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            <Table
              columns={columns}
              dataSource={data}
              rowSelection={rowSelection}
              pagination={{
                pageSize: productData?.limit,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                showQuickJumper: true
              }}
            />
            <Button onClick={start} disabled={!hasSelected} loading={loading}>
              Reload
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default List
