import { Modal, Row, Radio, Empty, message } from 'antd'
import { useGetAllVouchersQuery } from '../../api/voucher'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { IVoucher } from '../../interfaces/voucher.type'
import isExpiredVoucher from '../../utils/isExpiredVoucher'
import { GiTicket } from 'react-icons/gi'

type ModalListVouchersProps = {
  isOpen: boolean
  voucherChecked: IVoucher
  setVoucherChecked: React.Dispatch<React.SetStateAction<IVoucher>>
  toggleModal: () => void
}

const ModalListVouchers = ({ isOpen, toggleModal, voucherChecked, setVoucherChecked }: ModalListVouchersProps) => {
  const { data: vouchers } = useGetAllVouchersQuery()

  const onChange = (e: CheckboxChangeEvent) => {
    setVoucherChecked(e.target.value)
    message.success('Thêm mã thành công🎉', 0.5)
  }

  const onCancel = () => {
    toggleModal()
    setVoucherChecked({} as IVoucher)
  }

  return (
    <Modal
      title='Mã khuyến mại hôm nay 😍'
      destroyOnClose={true}
      open={isOpen}
      onOk={toggleModal}
      onCancel={onCancel}
      okType='danger'
      cancelText='Đóng'
      okText='Áp dụng'
      centered
    >
      <Row className='flex gap-x-3'>
        {vouchers && vouchers?.data?.docs.length > 0 ? (
          vouchers?.data?.docs?.map((voucher) => (
            <Radio.Group
              key={voucher._id}
              optionType='button'
              buttonStyle='solid'
              size='large'
              onChange={onChange}
              value={voucherChecked}
              className='my-2'
            >
              <Radio className='select-none' disabled={isExpiredVoucher(voucher?.endDate!)} value={voucher}>
                <div className='flex items-center justify-center gap-x-2'>
                  <GiTicket className='text-2xl' /> {voucher.code}
                </div>
              </Radio>
            </Radio.Group>
          ))
        ) : (
          <Empty />
        )}
      </Row>
    </Modal>
  )
}

export default ModalListVouchers
