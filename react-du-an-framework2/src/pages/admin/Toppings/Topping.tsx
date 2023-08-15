import { Button, Checkbox, Label, Modal, Table, TextInput } from 'flowbite-react';
import { HiCog, HiDotsVertical, HiExclamationCircle, HiPlus, HiTrash } from 'react-icons/hi';
import {
  useCreateToppingMutation,
  useDeleteToppingMutation,
  useGetAllToppingQuery,
  useUpdateToppingMutation,
} from '../../../api/topping';
import { useEffect, useState } from 'react';

import type { FC } from 'react';
import { ITopping } from '../../../interfaces/topping.type';
import Loading from '../../../components/Loading';
import { SizeSchema } from '../../../validate/Form';
import Swal from 'sweetalert2';
import { formatCurrency } from '../../../utils/formatCurrency';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const Topping = () => {
  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All toppings
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput id="users-search" name="users-search" placeholder="Search for users" />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Configure</span>
                  <HiCog className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Delete</span>
                  <HiTrash className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Purge</span>
                  <HiExclamationCircle className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Settings</span>
                  <HiDotsVertical className="text-2xl" />
                </a>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddToppingModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {/* <AllUsersTable /> */}
              <ToppingTable />
            </div>
          </div>
        </div>
      </div>
      {/* <Pagination /> */}
    </>
  );
};

const ToppingTable = () => {
  const { data: dataTopping, isLoading, isSuccess, isError } = useGetAllToppingQuery();
  // console.log(dataTopping)
  const [deleteTopping, responDelete] = useDeleteToppingMutation();
  const handleDeleteTopping = (id: string) => {
    if (!responDelete.isError) {
      Swal.fire({
        icon: 'info',
        title: 'Do you want to delete this size?',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
          }).then(async () => {
            await deleteTopping(id);
          });
        }
      });
    } else {
      toast.error('Delete failed!');
    }
  };
  if (isLoading) return <div>Loading.....</div>;
  if (isError) return <div>Loi roi</div>;
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>
          <Label htmlFor="select-all" className="sr-only">
            Select all
          </Label>
          <Checkbox id="select-all" name="select-all" />
        </Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Price</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {dataTopping?.data &&
          dataTopping.data.map((item, index: number) => (
            <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="w-4 p-4">
                <div className="flex items-center">
                  <Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
                  <label htmlFor="checkbox-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.name}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.price}
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center gap-x-3 whitespace-nowrap">
                  <EditToppingModal dataTopping={item} />
                  <Button color="failure">
                    <div
                      onClick={() => handleDeleteTopping(item._id!)}
                      className="flex items-center gap-x-2"
                    >
                      <HiTrash className="text-lg" />
                      Delete Topping
                    </div>
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

const AddToppingModal: FC = function () {
  const [isOpen, setOpen] = useState(false);
  const [createTopping, responCreateTopping] = useCreateToppingMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Pick<ITopping, 'name' | 'price'>>({
    mode: 'onChange',
    resolver: yupResolver<any>(SizeSchema),
  });

  const handleAdd = handleSubmit(async (data: Pick<ITopping, 'name' | 'price'>) => {
    if (data) {
      await createTopping(data);
      if (!responCreateTopping.isError) {
        toast.success(`Topping ${data.name}  added✔`);
        setOpen(false);
        reset();
      } else {
        toast.error('Add Topping failed!');
      }
    }
  });

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Topping
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new Topping</strong>
        </Modal.Header>
        <Modal.Body>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2" autoComplete="off">
            <div>
              <Label htmlFor="firstName">Name Topping</Label>
              <div className="mt-1">
                <TextInput {...register('name')} id="firstName" placeholder="Bonnie" />
                {errors && <span className="text-red-500 text-[13px]">{errors.name?.message}</span>}
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Price</Label>
              <div className="mt-1">
                <TextInput id="lastName" {...register('price')} placeholder="10" />
                {errors && (
                  <span className="text-red-500 text-[13px]">{errors.price?.message}</span>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={() => {
              handleAdd();
            }}
          >
            Add Topping
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditToppingModal = function ({ dataTopping }: { dataTopping: ITopping }) {
  const [isOpen, setOpen] = useState(false);
  const [updateTopping, responUpdate] = useUpdateToppingMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<Pick<ITopping, 'name' | 'price'>>({
    mode: 'onChange',
    resolver: yupResolver<any>(SizeSchema),
  });

  useEffect(() => {
    setValue('price', dataTopping.price);
    setValue('name', dataTopping.name);
  }, [dataTopping.name, dataTopping.price, setValue]);

  const handleAdd = handleSubmit(async (data: Pick<ITopping, 'name' | 'price'>) => {
    if (data) {
      await updateTopping({ ...data, _id: dataTopping._id });
      if (!responUpdate.isError) {
        toast.success(`Size ${data.name}  Update✔`);
        setOpen(false);
        reset();
      } else {
        toast.error('Update Topping failed!');
      }
    }
  });
  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Edit Topping
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Topping</strong>
        </Modal.Header>
        <Modal.Body>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2" autoComplete="off">
            <div>
              <Label htmlFor="firstName">Name Topping</Label>
              <div className="mt-1">
                <TextInput {...register('name')} id="firstName" placeholder="Bonnie" />
                {errors && <span className="text-red-500 text-[13px]">{errors.name?.message}</span>}
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Price</Label>
              <div className="mt-1">
                <TextInput id="lastName" {...register('price')} placeholder="10" />
                {errors && (
                  <span className="text-red-500 text-[13px]">{errors.price?.message}</span>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={() => {
              handleAdd();
            }}
          >
            Edit Topping
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Topping;
