import { Button, Checkbox, Label, Modal, Select, Table, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { HiCog, HiDotsVertical, HiExclamationCircle, HiPlus, HiTrash } from 'react-icons/hi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IRole } from '../../../interfaces/role.type';

import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RoleForm, RoleSchema } from '../../../validate/Form';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
  useUpdateRoleMutation,
} from '../../../api/role';

const Role = () => {
  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All roles
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
              <AddRoleModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <RoleTable />
            </div>
          </div>
        </div>
      </div>
      {/* <Pagination /> */}
    </>
  );
};

const RoleTable = () => {
  const { data: roles, isLoading, isError } = useGetAllRolesQuery();
  const [deleteRole, { isLoading: isDeleting, isError: isDeleteErr }] = useDeleteRoleMutation();

  const handleDelete = (id: string) => {
    Swal.fire({
      icon: 'question',
      title: 'Do you want to delete this role?',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
        }).then(() =>
          deleteRole(id).then(() => {
            if (!isDeleteErr) {
              toast.success('Delete success');
            } else {
              toast.error('Delete failed');
            }
          })
        );
      }
    });
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Loi roi</div>;
  return (
    <>
      <Table className="min-w-full min-h-[100vh] divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>
            <Label htmlFor="select-all" className="sr-only">
              Select all
            </Label>
            <Checkbox id="select-all" name="select-all" />
          </Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {roles &&
            roles.data?.map((item) => (
              <Table.Row key={item._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Table.Cell className="w-4 p-4">
                  <div className="flex items-center">
                    <Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
                    <label htmlFor="checkbox-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white capitalize">
                  {item.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white capitalize">
                  {item.status}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-x-3 whitespace-nowrap">
                    <EditRoleModal role={item} />
                    <Button color="failure" onClick={() => handleDelete(item._id!)}>
                      <div className="flex items-center gap-x-2">
                        {isDeleting ? (
                          <AiOutlineLoading3Quarters className="text-lg rotate" />
                        ) : (
                          <HiTrash className="text-lg" />
                        )}
                        Delete Role
                      </div>
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {/* {idRole && (
        <EditRoleModal isOpen={isEditPopupOpen} togglePopup={togglePopup} idRole={idRole} />
      )} */}
    </>
  );
};

const AddRoleModal = function () {
  const [addRole, { isLoading, isError }] = useAddRoleMutation();
  const [isOpen, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleForm>({
    mode: 'onChange',
    resolver: yupResolver(RoleSchema),
  });

  const onHandleSubmit = async (data: any) => {
    await addRole(data);
    if (!isError) {
      toast.success(`Added ${data.name} role`);
      reset();
      setOpen(false);
    }
  };
  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Role
        </div>
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
          reset();
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new role</strong>
        </Modal.Header>
        <form action="" onSubmit={handleSubmit(onHandleSubmit)}>
          <Modal.Body>
            <div className="">
              <div>
                <Label htmlFor="firstName">Name Role</Label>
                <div className="mt-1">
                  <TextInput {...register('name')} placeholder="Name of role" />
                </div>
                <span className="text-red-500 text-sm block my-2">
                  {errors.name && errors.name.message}
                </span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="primary">
              {isLoading ? <AiOutlineLoading3Quarters className="text-lg rotate" /> : 'Add Role'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

type EditRoleModalProps = {
  role: IRole;
};
const EditRoleModal = function ({ role }: EditRoleModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [updateRole, { isLoading, isError }] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleForm>({
    mode: 'onChange',
    resolver: yupResolver(RoleSchema),
    defaultValues: {
      ...role,
    },
  });

  const onHandleSubmit = async (data: any) => {
    await updateRole(data);
    if (!isError) {
      toast.success(`Updated ${data.name} role`);
      setOpen(false);
    } else {
      toast.error('Update failed');
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Edit Role
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Role</strong>
        </Modal.Header>
        <form action="" onSubmit={handleSubmit(onHandleSubmit)}>
          <Modal.Body>
            <div className="">
              <div>
                <Label htmlFor="firstName">Name Role</Label>
                <div className="mt-1">
                  <TextInput {...register('name')} placeholder="Name of role" />
                </div>
                <span className="text-red-500 text-sm block my-2">
                  {errors.name && errors.name.message}
                </span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="primary">
              {isLoading ? <AiOutlineLoading3Quarters className="text-lg rotate" /> : 'Edit Role'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default Role;
