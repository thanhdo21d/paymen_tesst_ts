import { Button, Checkbox, Table } from 'flowbite-react'

import { HiTrash } from 'react-icons/hi'
import EditProductModal from './editProduct'
import { useDeleteFakeProductMutation, useFetchProductsQuery } from '../../api/Product'

import { formatCurrency } from '../../utils/formatCurrency'

import ShowProduct from './showProduct'
import Loading from '../Loading'

const ProductsTable = function () {
  // const [isOpenModalEdit, setOpenModalEdit] = useState(false);
  const { data, isLoading } = useFetchProductsQuery()
  const [deleteFakeProduct] = useDeleteFakeProductMutation()
  if (isLoading) return <Loading />

  return (
    <Table className='dark:divide-gray-600 min-w-full divide-y divide-gray-200'>
      <Table.Head className='dark:bg-gray-700 text-center bg-gray-100'>
        <Table.HeadCell>
          <span className='sr-only'>Toggle selected</span>
          <Checkbox />
        </Table.HeadCell>
        <Table.HeadCell>Index</Table.HeadCell>
        <Table.HeadCell>Product Name</Table.HeadCell>
        <Table.HeadCell>Images</Table.HeadCell>
        <Table.HeadCell>Category</Table.HeadCell>
        <Table.HeadCell colSpan={3}>Actions</Table.HeadCell>
      </Table.Head>
      {/* {isLoading ? (
        <h2>Loading</h2>
      ) : ( */}
      <Table.Body className='dark:divide-gray-700 dark:bg-gray-800 bg-white divide-y divide-gray-200'>
        {data?.docs.map((product, index: number) => (
          <Table.Row key={index} className='hover:bg-gray-100 dark:hover:bg-gray-700 text-center'>
            <Table.Cell className='w-4 p-4'>
              <Checkbox />
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
              {index + 1}
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap dark:text-gray-400 p-4 text-sm font-normal text-gray-500'>
              <div className='dark:text-white text-base font-semibold text-gray-900'>{product.name}</div>
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
              <img src={product.images[0]?.url} alt='' className='w-10 h-10' />
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
              {product.category?.name}
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
              {formatCurrency(product.price)}
            </Table.Cell>
            <Table.Cell className='whitespace-nowrap p-4 space-x-2'>
              <div className='gap-x-3 flex items-center'>
                {/* <Button color="primary" onClick={() => setOpenModalEdit(!isOpenModalEdit)}>
                    <FaPlus className="mr-3 text-sm" />
                    Edit product
                  </Button> */}
                <ShowProduct product={product} />
                <EditProductModal DataEdit={product} />
                <Button color='failure' onClick={() => deleteFakeProduct(product._id!)}>
                  <HiTrash className='text-center' />
                </Button>
                {/* {isOpenModalEdit ? ( */}
                {/* ) : (
                    ''
                  )} */}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      {/* )} */}
    </Table>
  )
}

export default ProductsTable
