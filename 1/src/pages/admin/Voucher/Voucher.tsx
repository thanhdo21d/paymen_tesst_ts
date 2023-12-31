import { Button, Checkbox, Label, Modal, Table, TextInput } from 'flowbite-react'
import {
  HiCog,
  HiDocumentDownload,
  HiDotsVertical,
  HiExclamationCircle,
  HiPencil,
  HiPlus,
  HiTrash
} from 'react-icons/hi'
import { VoucherForm, VoucherSchema } from '../../../validate/Form'
import {
  useAddVoucherMutation,
  useDeleteVoucherMutation,
  useGetAllVouchersQuery,
  useUpdateVoucherMutation
} from '../../../api/voucher'
import { useEffect, useState } from 'react'

import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IVoucher, IVoucherDocs } from '../../../interfaces/voucher.type'
import Loading from '../../../components/Loading'
import Swal from 'sweetalert2'
import { exportToExcel } from '../../../utils/excelExport'
import { formatCurrency } from '../../../utils/formatCurrency'
import formatDate from '../../../utils/formatDate'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import isExpiredVoucher from '../../../utils/isExpiredVoucher'
import Pagination from '../../../components/admin/Pagination'

const Voucher = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data: vouchers, isLoading } = useGetAllVouchersQuery(currentPage)
  const [data, _] = useState<any>([])

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }
  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }
  useEffect(() => {
    const rows = vouchers?.data?.docs?.map((item: IVoucher) => [
      item.code,
      item.discount,
      item.sale,
      item.startDate,
      item.endDate,
      item.isActive,
      item.createdAt,
      item.updatedAt
    ])
    console.log('🚀 ~ file: Voucher.tsx:45 ~ useEffect ~ rows:', rows)
  }, [vouchers])
  return (
    <>
      <div className='dark:border-gray-700 dark:bg-gray-800 sm:flex items-center justify-between block p-4 bg-white border-b border-gray-200'>
        <div className='w-full mb-1'>
          <div className='mb-4'>
            <h1 className='dark:text-white sm:text-2xl text-xl font-semibold text-gray-900'>All Vouchers</h1>
          </div>
          <div className='sm:flex'>
            <div className='dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 items-center hidden mb-3'>
              <form className='lg:pr-3'>
                <Label htmlFor='users-search' className='sr-only'>
                  Search
                </Label>
                <div className='lg:w-64 xl:w-96 relative mt-1'>
                  <TextInput id='users-search' name='users-search' placeholder='Search for users' />
                </div>
              </form>
              <div className='sm:mt-0 sm:pl-2 flex pl-0 mt-3 space-x-1'>
                <a
                  href='#'
                  className='hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer'
                >
                  <span className='sr-only'>Configure</span>
                  <HiCog className='text-2xl' />
                </a>
                <a
                  href='#'
                  className='hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer'
                >
                  <span className='sr-only'>Delete</span>
                  <HiTrash className='text-2xl' />
                </a>
                <a
                  href='#'
                  className='hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer'
                >
                  <span className='sr-only'>Purge</span>
                  <HiExclamationCircle className='text-2xl' />
                </a>
                <a
                  href='#'
                  className='hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer'
                >
                  <span className='sr-only'>Settings</span>
                  <HiDotsVertical className='text-2xl' />
                </a>
              </div>
            </div>
            <div className='sm:space-x-3 flex items-center ml-auto space-x-2'>
              <AddVoucherModal />

              <Button color='gray' onClick={() => exportToExcel(data, 'vouchers')}>
                <div className='gap-x-3 flex items-center'>
                  <HiDocumentDownload className='text-xl' />
                  <span>Export</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            <div className='overflow-hidden shadow'>
              <VouchersTable vouchers={vouchers!} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
      {vouchers && vouchers.data.totalPages > 1 && (
        <Pagination
          nextPage={handleNextPage}
          prevPage={handlePrevPage}
          hasNext={vouchers.data.hasNextPage!}
          hasPrev={vouchers.data.hasPrevPage!}
          totalDocs={vouchers.data.totalDocs}
        />
      )}
    </>
  )
}

type VouchersTableProps = {
  vouchers: IVoucherDocs
  isLoading: boolean
}
const VouchersTable = ({ vouchers, isLoading }: VouchersTableProps) => {
  // const { data: vouchers, isLoading } = useGetAllVouchersQuery()
  const [_, setData] = useState<any>([])
  const [deleteVoucher, { isError: isDeleteErr, isLoading: isDelteLoading }] = useDeleteVoucherMutation()
  useEffect(() => {
    const rows = [
      ['Code', 'Discount', 'Sale', 'Start Date', 'End Date', 'Is Active', 'Created At', 'Updated At'],
      vouchers?.data?.docs?.map((item: IVoucher) => [
        item.code,
        item.discount,
        item.sale,
        item.startDate,
        item.endDate,
        item.isActive,
        item.createdAt,
        item.updatedAt
      ])
    ]
    setData(rows)
  }, [vouchers])
  const handleDelete = (id: string) => {
    Swal.fire({
      icon: 'question',
      title: 'Do you want to delete this voucher?',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted'
        }).then(() =>
          deleteVoucher(id).then(() => {
            if (!isDeleteErr) {
              toast.success('Deleted success')
            } else {
              toast.error('Delete failed')
            }
          })
        )
      }
    })
  }
  if (isLoading) return <Loading />
  return (
    <>
      <Table className='min-w-full min-h-[100vh] divide-y divide-gray-200 dark:divide-gray-600'>
        <Table.Head className='dark:bg-gray-700 bg-gray-100'>
          <Table.HeadCell>
            <Label htmlFor='select-all' className='sr-only'>
              Select all
            </Label>
            <Checkbox id='select-all' name='select-all' />
          </Table.HeadCell>
          <Table.HeadCell>Code</Table.HeadCell>
          <Table.HeadCell>Discount</Table.HeadCell>
          <Table.HeadCell>Sale</Table.HeadCell>
          <Table.HeadCell>Start Date</Table.HeadCell>
          <Table.HeadCell>End Date</Table.HeadCell>
          <Table.HeadCell>Expried</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className='dark:divide-gray-700 dark:bg-gray-800 bg-white divide-y divide-gray-200'>
          {vouchers &&
            vouchers.data.docs.length > 0 &&
            vouchers.data.docs.map((item: IVoucher) => (
              <Table.Row key={item._id} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                <Table.Cell className='w-4 p-4'>
                  <div className='flex items-center'>
                    <Checkbox aria-describedby='checkbox-1' id='checkbox-1' />
                    <label htmlFor='checkbox-1' className='sr-only'>
                      checkbox
                    </label>
                  </div>
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
                  {item.code}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
                  {item.discount}%
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
                  {formatCurrency(item.sale)}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
                  {formatDate(item.startDate!)}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900'>
                  {formatDate(item.endDate!)}
                </Table.Cell>
                <Table.Cell
                  className={`
                      whitespace-nowrap dark:text-white p-4 text-base font-medium text-gray-900`}
                >
                  <span
                    className={`${
                      isExpiredVoucher(item.endDate!) === true ? 'bg-red-400 ' : 'bg-green-400 '
                    } rounded inline-block px-2 text-white`}
                  >
                    {isExpiredVoucher(item.endDate!) ? 'Expired' : 'Unexpired'}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <div className='gap-x-3 whitespace-nowrap flex items-center'>
                    {item && <EditVoucherModal voucher={item} />}
                    {isExpiredVoucher(item.endDate!) ? (
                      <Button color='failure' onClick={() => handleDelete(item._id!)}>
                        <div className='gap-x-2 flex items-center'>
                          {isDelteLoading ? (
                            <AiOutlineLoading3Quarters className='rotate text-lg' />
                          ) : (
                            <HiTrash className='text-lg' />
                          )}
                          Delete Voucher
                        </div>
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  )
}

const AddVoucherModal = function () {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [addVoucher, { isLoading }] = useAddVoucherMutation()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<VoucherForm>({
    mode: 'onChange',
    resolver: yupResolver(VoucherSchema)
  })

  const onhandleSubmit = async (data: any) => {
    await addVoucher({ code: data.code.toUpperCase(), discount: data.discount, sale: data.sale })
      .unwrap()
      .then(() => {
        toast.success(`Added voucher ${data.code}`)
        reset()
        setOpen(false)
      })
      .catch(() => {
        toast.error(`Added failed. Please try again.`)
      })
  }
  return (
    <>
      <Button color='primary' onClick={() => setOpen(true)}>
        <div className='gap-x-3 flex items-center'>
          <HiPlus className='text-xl' />
          Add Voucher
        </div>
      </Button>
      <Modal
        onClose={() => {
          setOpen(false)
          reset()
        }}
        show={isOpen}
      >
        <Modal.Header className='border-b border-gray-200 !p-6 dark:border-gray-700'>
          <strong>Add new voucher</strong>
        </Modal.Header>
        <form action='' onSubmit={handleSubmit(onhandleSubmit)}>
          <Modal.Body>
            <div className='sm:grid-cols-2 grid grid-cols-1 gap-6'>
              <div>
                <Label htmlFor='firstName'>Code</Label>
                <div className='mt-1'>
                  <TextInput {...register('code')} placeholder='Code' />
                </div>
                <span className='block my-2 text-sm text-red-500'>{errors.code && errors.code.message}</span>
              </div>
              <div>
                <Label htmlFor='firstName'>Discount</Label>
                <div className='mt-1'>
                  <TextInput {...register('discount')} type='number' placeholder='Price' />
                </div>
                <span className='block my-2 text-sm text-red-500'>{errors.discount && errors.discount.message}</span>
              </div>
              <div>
                <Label htmlFor='firstName'>Sale</Label>
                <div className='mt-1'>
                  <TextInput {...register('sale')} type='number' placeholder='Price' />
                </div>
                <span className='block my-2 text-sm text-red-500'>{errors.sale && errors.sale.message}</span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' color='primary'>
              {isLoading ? <AiOutlineLoading3Quarters className='rotate text-lg' /> : 'Add Voucher'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

type EditVoucherModalProps = {
  voucher: IVoucher
}
const EditVoucherModal = ({ voucher }: EditVoucherModalProps) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [updateVoucher, { isLoading }] = useUpdateVoucherMutation()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VoucherForm>({
    mode: 'onChange',
    resolver: yupResolver(VoucherSchema),
    defaultValues: {
      ...voucher
    } as any
  })

  const onhaneleSubmit = async (data: any) => {
    await updateVoucher({ ...data, code: data.code.toUpperCase() })
      .unwrap()
      .then(() => {
        toast.success('Updated')
        setOpen(false)
      })
      .catch(() => {
        toast.error('Update failed')
      })
  }
  return (
    <>
      <Button color='primary' onClick={() => setOpen(true)}>
        <div className='gap-x-3 flex items-center'>
          <HiPencil className='text-xl' />
          Edit Voucher
        </div>
      </Button>
      <Modal
        onClose={() => {
          setOpen(false)
        }}
        show={isOpen}
        className='!bg-opacity-20'
      >
        <Modal.Header className='border-b border-gray-200 !p-6 dark:border-gray-700'>
          <strong>Edit voucher</strong>
        </Modal.Header>
        <form action='' onSubmit={handleSubmit(onhaneleSubmit)}>
          <Modal.Body>
            <div className='sm:grid-cols-2 grid grid-cols-1 gap-6'>
              <div>
                <Label htmlFor='code'>Code</Label>
                <div className='mt-1'>
                  <TextInput {...register('code')} id='code' placeholder='Code' />
                </div>
                <span className='block my-2 text-sm text-red-500'>{errors.code && errors.code.message}</span>
              </div>
              <div>
                <Label htmlFor='discount'>Discount</Label>
                <div className='mt-1'>
                  <TextInput {...register('discount')} type='number' id='discount' placeholder='Discount' />
                </div>
                <span className='block my-2 text-sm text-red-500'>{errors.discount && errors.discount.message}</span>
              </div>
              <div>
                <Label htmlFor='sale'>Sale</Label>
                <div className='mt-1'>
                  <TextInput {...register('sale')} type='number' id='sale' placeholder='Sale' />
                </div>
                <span className='block my-2 text-sm text-red-500'>{errors.sale && errors.sale.message}</span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' color='primary'>
              {isLoading ? <AiOutlineLoading3Quarters className='rotate text-lg' /> : 'Edit Voucher'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default Voucher
