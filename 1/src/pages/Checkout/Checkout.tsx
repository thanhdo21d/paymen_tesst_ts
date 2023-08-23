import { Button, Input } from '../../components'
import { FaAngleDown, FaMapMarkerAlt, FaPhoneAlt, FaStickyNote } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BiSolidUser } from 'react-icons/bi'
import { CartItemState } from '../../store/slices/types/cart.type'
import CheckoutItem from '../../components/Checkout-Item'
import { UserCheckoutSchema } from '../../validate/Form'
import { formatCurrency } from '../../utils/formatCurrency'
import { resetAllCart } from '../../store/slices/cart.slice'
import styles from './Checkout.module.scss'
import { toast } from 'react-toastify'
import { useCreateOrderMutation } from '../../store/slices/order'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { yupResolver } from '@hookform/resolvers/yup'
import ModalListVouchers from '../../components/ModalListVouchers'
import { IVoucher } from '../../interfaces/voucher.type'

//
const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [voucherChecked, setVoucherChecked] = useState({} as IVoucher)

  const [orderAPIFn] = useCreateOrderMutation()
  const dispatch = useAppDispatch()

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(UserCheckoutSchema)
  })

  const dataCartCheckout = useAppSelector((state) => state.persistedReducer.cart)
  const dataInfoUser = useAppSelector((state) => state.persistedReducer.auth)
  const textNoteOrderRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (dataInfoUser.user) {
      dataInfoUser.user.username && setValue('name', dataInfoUser.user.username)
      dataInfoUser.user.address && setValue('shippingLocation', dataInfoUser.user.address)
    }
  }, [dataInfoUser.user, dataInfoUser.user.address, dataInfoUser.user.username, setValue])

  const getData = useCallback(
    (getData: string) => {
      const arrTotal: Omit<CartItemState, 'total'>[] = []
      const arrTotalNumbers: number[] = []
      dataCartCheckout.items.map((item: any) =>
        item.items.map((data: any) => {
          if (getData == 'list') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { total, ...rest } = data
            arrTotal.push(rest)
          } else {
            let value: number | undefined
            if (getData === 'quantity') {
              value = data.quantity
            } else if (getData === 'total') {
              value = data.total
            }

            if (value !== undefined) {
              arrTotalNumbers.push(value)
            }
          }
        })
      )
      return getData == 'list' ? arrTotal : arrTotalNumbers
    },
    [dataCartCheckout.items]
  )

  const moneyShipping = useMemo(() => 117000, [])
  const moneyPromotion = useMemo(() => 0 as number, [])
  const totalMoneyCheckout = useMemo(() => {
    const all = getData('total') as number[]
    return all.reduce((acc: number, curent: number) => {
      const a = acc + curent
      return a
    }, 0)
  }, [getData])
  const totalQuantity = useMemo(() => {
    const all = getData('quantity') as number[]

    const a = all.reduce((acc, curent) => {
      return acc + curent
    }, 0)
    return a
  }, [getData])

  const totalAllMoneyCheckOut = useMemo(() => {
    return moneyShipping + moneyPromotion + totalMoneyCheckout
  }, [moneyPromotion, moneyShipping, totalMoneyCheckout])

  const handleFormInfoCheckout = handleSubmit(async (data) => {
    if (!(dataInfoUser.user.accessToken && dataInfoUser.user._id)) {
      return navigate('/sign')
    } else {
      const productOrder = getData('list')
      console.log('🚀 ~ file: Checkout.tsx:100 ~ handleFormInfoCheckout ~ productOrder:', productOrder)
      console.log(data)
      const dataForm = {
        user: dataInfoUser.user && dataInfoUser.user._id,
        items: getData('list'),
        total: totalAllMoneyCheckOut,
        priceShipping: moneyShipping,
        noteOrder: textNoteOrderRef.current?.value !== '' ? textNoteOrderRef.current?.value : ' ',
        paymentMethodId: 'cod',
        inforOrderShipping: {
          name: data.name,
          phone: data.phone,
          address: data.shippingLocation,
          noteShipping: data.shippingNote
        }
      }
      console.log(dataForm)
      orderAPIFn(dataForm).then((res: any) => {
        if (res.error) {
          return toast.error('Đặt hàng thất bại' + res.error.data.error)
        } else {
          reset()
          dispatch(resetAllCart())
          toast.success('Bạn đặt hàng thành công')
          // alert(data.shippingNote)

          // reset();
          // dispatch(resetAllCart());
          // navigate('http://localhost:4000/vnpay');
          const returnUrl = 'http://localhost:5173' // url trả về
          window.location.href =
            'http://ketquaday99.com/vnpay/fast?amount=' +
            dataForm.total +
            '&txt_inv_mobile=' +
            data.phone +
            '&txt_billing_fullname=' +
            data.name +
            '&txt_ship_addr1=' +
            data.shippingLocation +
            '&returnUrl=' +
            returnUrl
        }
      })
    }
  })

  return (
    <div className='w-auto lg:w-[1200px] max-w-[1200px] my-0 mx-auto'>
      <div className='detail gap-y-10 lg:gap-y-0 lg:flex-row flex flex-col justify-between mt-6'>
        <form id='form_info_checkout' className='left w-full lg:w-[60%]' method='get' action='.pay'>
          <div className='title flex justify-between items-center px-5 mb-[7px] '>
            <div>
              <h2 className='text-sm font-bold'>Thông tin giao hàng</h2>
            </div>
            <div className='text-[#adaeae]'>
              <FaAngleDown />
            </div>
          </div>
          <div className='content shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] px-5'>
            <div className='py-[10px]'>
              <Input
                name='name'
                register={register}
                error={errors.name?.message}
                prefix={<BiSolidUser />}
                placeholder='Tên người nhận'
              />
            </div>
            <div className='py-[10px]'>
              <Input
                prefix={<FaPhoneAlt />}
                placeholder='Số điện thoại người nhận'
                name='phone'
                register={register}
                error={errors.phone?.message}
              />
            </div>

            <div className='location'>
              <div className='title pt-[10px] text-sm'>
                <h2>Giao đến</h2>
              </div>
              <div className='py-[10px]'>
                <Input
                  prefix={<FaMapMarkerAlt />}
                  placeholder='Địa chỉ người nhận'
                  name='shippingLocation'
                  error={errors.shippingLocation?.message}
                  register={register}
                />
              </div>
            </div>
            <div className='py-[10px]'>
              <Input
                prefix={<FaStickyNote />}
                placeholder='Ghi chú địa chỉ...'
                name='shippingNote'
                error={errors.shippingNote?.message}
                register={register}
              />
            </div>
          </div>
          <div className=' mt-8'>
            <div className='title mb-[7px] px-5'>
              <h2 className='text-sm font-semibold'>Phương thức thanh toán</h2>
            </div>
            <div className='shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] bg-white p-5'>
              <label className={` ${styles.container_radio} cod-payment block group`}>
                <span className='text-sm'>Thanh toán khi nhận hàng</span>
                <input
                  className='absolute opacity-0'
                  defaultChecked
                  type='radio'
                  value='cold'
                  {...register('paymentMethod')}
                />
                <span className={`${styles.checkmark_radio} group-hover:bg-[#ccc]`}></span>
              </label>
              <label className={` ${styles.container_radio} cod-payment block group`}>
                <span className='text-sm'>Thanh toán qua Ví vnPay</span>
                <input
                  className='absolute opacity-0'
                  defaultChecked
                  type='radio'
                  value='vnpay'
                  {...register('paymentMethod')}
                />
                <span className={`${styles.checkmark_radio} group-hover:bg-[#ccc]`}></span>
              </label>
              <label className={` ${styles.container_radio} momo-payment block group`}>
                <span className='text-sm'>Thanh toán qua Ví MoMo</span>
                <input className='absolute opacity-0' type='radio' value='momo' {...register('paymentMethod')} />
                <span className={`${styles.checkmark_radio} group-hover:bg-[#ccc]`}></span>
              </label>
              {errors.paymentMethod && <span className='text-red-500 text-[13px]'>{errors.paymentMethod.message}</span>}
            </div>
          </div>
        </form>
        <div className='right w-full lg:w-[40%] lg:pl-4'>
          <div className='title flex justify-between items-center px-5 mb-[7px] '>
            <div>
              <h2 className='text-sm font-bold'>Thông tin đơn hàng</h2>
            </div>
            <div className='text-[#adaeae]'>
              <FaAngleDown />
            </div>
          </div>
          <div className='content shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] px-5 py-5'>
            {/* <div className='store pt-[14px] pb-[10px] border-transparent border border-b-[#f1f1f1]'>
              <h3 className='text-sm'>Chọn cửa hàng</h3>
              <div className=' flex items-center justify-between cursor-pointer'>
                <div className='gap-x-2 flex items-center'>
                  <FaStore />
                  <span className='text-sm'>MilkTea - 93 Hoàng Công</span>
                </div>
                <div className='gap-x-2 flex items-center'>
                  <span className='text-sm'>20.45km</span>
                  <FaAngleDown className='text-[#adaeae]' />
                </div>
              </div>
            </div> */}
            <div className='list'>
              {dataCartCheckout.items &&
                dataCartCheckout.items.map((item) => <CheckoutItem key={uuidv4()} dataCartCheckout={item} />)}
              {/* <CheckoutItem /> */}
            </div>
            <div className='pt-[10px] pb-[15px] flex items-center justify-between border-transparent border border-b-[#f1f1f1]'>
              <div className='gap-x-4 flex items-center max-w-[50%]'>
                <img className='w-[24px] max-w-[24px]' src='/icon-promotion.png' alt='' />
                <span className='text-sm line-clamp-1'>
                  {Object.keys(voucherChecked).length > 0 ? voucherChecked.code : 'Mã khuyến mại'}
                </span>
              </div>
              <div className=''>
                <Button size='medium' shape='circle' onClick={toggleModal}>
                  Thêm khuyến mại
                </Button>
              </div>
            </div>
            <div className='py-[6px] border-transparent border border-b-[#f1f1f1]'>
              <div className=' flex items-center justify-between'>
                <div className='text-sm'>
                  <p>
                    Số lượng cốc: <span className='font-bold'>{totalQuantity}</span> cốc
                  </p>
                </div>
                <div className='flex items-center py-1 text-sm'>
                  <span>Tổng: </span>
                  <span className='font-bold w-[80px] text-right'>{formatCurrency(totalMoneyCheckout)}</span>
                </div>
              </div>
              <div className='flex justify-end py-1 text-sm'>
                <span>Phí vận chuyển: </span>
                <span className='w-[80px] text-right'>{formatCurrency(moneyShipping)}</span>
              </div>
              <div className='flex justify-end py-1 text-sm'>
                <span>Khuyến mãi: </span>
                <span className='w-[80px] text-right'>{formatCurrency(moneyPromotion)}</span>
              </div>
              <div className='flex justify-end py-1 text-sm'>
                <span className='font-bold'>Tổng cộng: </span>
                <span className='w-[80px] text-right text-[#86744e] font-bold'>
                  {formatCurrency(totalAllMoneyCheckOut)}
                </span>
              </div>
            </div>
            <div className='note'>
              <textarea
                ref={textNoteOrderRef}
                name=''
                id=''
                placeholder='Thêm ghi chú...'
                className='w-full text-sm border-none outline-none'
              ></textarea>
            </div>
            <div className=''>
              <Button type='checkout' size='large' shape='circle'>
                <span className='block' onClick={handleFormInfoCheckout}>
                  Đặt hàng
                </span>
              </Button>

              <Link to='/products'>
                <Button type='keep-buying' size='large' shape='circle'>
                  Tiếp tục mua hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ModalListVouchers
        isOpen={isModalOpen}
        voucherChecked={voucherChecked}
        setVoucherChecked={setVoucherChecked}
        toggleModal={toggleModal}
      />
    </div>
  )
}

export default Checkout
