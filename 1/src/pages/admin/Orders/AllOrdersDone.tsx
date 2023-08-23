import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useGetAllOrderDoneQuery } from '../../../store/slices/order'
import { LuClipboardEdit } from 'react-icons/lu'
import { v4 as uuid } from 'uuid'
import formatDate from '../../../utils/formatDate'
import { useState } from 'react'
import Pagination from '../../../components/admin/Pagination'
const AllOrdersDone = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data } = useGetAllOrderDoneQuery(currentPage)

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }
  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }
  return (
    <>
      <Table hoverable className='w-full h-full'>
        <Table.Head>
          <Table.HeadCell>Stt</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Time Order</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
          {/* <Table.HeadCell>
            <span className='sr-only'>Edit</span>
          </Table.HeadCell> */}
        </Table.Head>
        <Table.Body className='divide-y'>
          {data &&
            data.docs.length > 0 &&
            data.docs.map((order, index: number) => (
              <Table.Row className='dark:border-gray-700 dark:bg-gray-800 w-full bg-white' key={uuid()}>
                <Table.Cell className='whitespace-nowrap dark:text-white font-medium text-gray-900'>
                  {index + 1}
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-4'>
                    <img
                      className='h-14 w-14 object-cover rounded-full'
                      src={order.user.avatar}
                      alt={order.inforOrderShipping.name}
                    />
                    <div className=''>
                      <p className='dark:text-white text-base font-semibold text-gray-900'>{order.user.username}</p>
                      <p className='dark:text-gray-400 text-sm font-normal text-gray-500'>
                        {order.inforOrderShipping.phone}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{order.inforOrderShipping.address}</Table.Cell>
                <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900 capitalize'>
                  <span className='inline-block px-2 py-1 text-white bg-green-600 rounded'>{order.status}</span>
                </Table.Cell>
                <Table.Cell>
                  <Button color='primary'>
                    <Link to={`/admin/orders/${order._id}`} className='gap-x-3 flex items-center'>
                      <LuClipboardEdit className='text-xl' />
                      Detail
                    </Link>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {data && data.totalPages > 1 && (
        <Pagination
          nextPage={handleNextPage}
          prevPage={handlePrevPage}
          hasNext={data.hasNextPage}
          hasPrev={data.hasPrevPage}
          totalDocs={data.totalDocs}
        />
      )}
    </>
  )
}

export default AllOrdersDone
