import { Button, Table } from 'flowbite-react'

import { Link } from 'react-router-dom'
import { LuClipboardEdit } from 'react-icons/lu'
import formatDate from '../../../utils/formatDate'
import { useGetAllOrderCancelQuery } from '../../../store/slices/order'
import { v4 as uuid } from 'uuid'
import Pagination from '../../../components/admin/Pagination'
import { useState } from 'react'
// import { type } from 'os'

const AllOrdersCanceled = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data } = useGetAllOrderCancelQuery(currentPage)

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }
  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }
  return (
    <>
      <Table hoverable className='min-w-full min-h-[100vh] divide-y divide-gray-200 dark:divide-gray-600'>
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
            data.docs.map((item, index) => (
              <Table.Row className='dark:border-gray-700 dark:bg-gray-800 w-full bg-white' key={uuid()}>
                <Table.Cell className='whitespace-nowrap dark:text-white font-medium text-gray-900'>
                  {index + 1}
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-4'>
                    <img
                      className='h-14 w-14 object-cover rounded-full'
                      src={item.user?.avatar}
                      alt={item.inforOrderShipping.name}
                    />
                    <div className=''>
                      <p className='dark:text-white text-base font-semibold text-gray-900'>{item.user?.username}</p>
                      <p className='dark:text-gray-400 text-sm font-normal text-gray-500'>
                        {item.inforOrderShipping.phone}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{item.inforOrderShipping.address}</Table.Cell>
                <Table.Cell>{formatDate(item.createdAt)}</Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900 capitalize'>
                  <span className='inline-block px-2 py-1 text-white bg-red-600 rounded'>{item.status}</span>
                </Table.Cell>
                <Table.Cell>
                  <Button color='primary'>
                    <Link to={`/admin/orders/${item._id}`} className='gap-x-3 flex items-center'>
                      <LuClipboardEdit className='text-xl' />
                      Detail
                    </Link>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          {data && data.docs.length === 0 && (
            <Table.Row className='dark:border-gray-700 dark:bg-gray-800 w-full bg-white'>
              <Table.Cell className='whitespace-nowrap dark:text-white flex items-center justify-center font-medium text-gray-900'>
                No data
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {data && (
        <Pagination
          nextPage={handleNextPage}
          prevPage={handlePrevPage}
          totalDocs={data.totalDocs}
          hasNext={data.hasNextPage}
          hasPrev={data.hasPrevPage}
        />
      )}
    </>
  )
}

export default AllOrdersCanceled
