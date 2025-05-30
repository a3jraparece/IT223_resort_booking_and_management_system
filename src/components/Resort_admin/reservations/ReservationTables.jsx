import React, { useRef, useState, useEffect } from 'react'
import FilterAndActions from '../../ui/table/FilterAndActions'
import TableData from '../../ui/table/TableData'
import Table from '../../ui/table/Table'
import ToggleDiv from '../../ui/modals/ToggleDiv'
import Pagination from '../../ui/table/Pagination'
import Modal from '../../ui/modals/Modal'
import ActionNotification from '../../../components/ui/modals/ActionNotification';

import { ReservationsFilterModal } from '../../../pages/resort_admin/modals'
import { useFetchReservations, useFetchUserRoleWithResortId } from '../../../hooks'

import { MdOutlineDeleteForever } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import { LuEye } from 'react-icons/lu'

import { BookingCard } from '../index';

const ReservationTables = ({ filters_data, reservation_data }) => {
  const containerRef = useRef(null);

  const [filters, setFilters] = filters_data;

  const { reservations, setReservations, loading, error, setError, fetchReservations } = reservation_data;

  // Forms
  const [createReservationtForm, setReservationResortForm] = useState({
    values: { user_id: '' },
    errors: { user_id: '' }
  });

  const [editReservationForm, setEditReservationForm] = useState({
    values: { id: '', name: '', location: '', location_coordinates: '', tax_rate: '', status: '', contact_details: '' },
    errors: { id: '', name: '', location: '', location_coordinates: '', tax_rate: '', status: '', email: '', contact_details: '' }
  });

  const [deleteReservationForm, setDeleteReservationForm] = useState({
    resort_id: ''
  });

  const [notify, setNotify] = useState({ open: '', variant: '', message: '' });
  const [modal, setModal] = useState({ isOpen: false, variant: 'default', children: <div></div>, loading: false, title: '' });

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const openModal = (variant, booking) => {
    let children;
    let modal_title;

    switch (variant) {
      case 'create':
        modal_title = 'New Reservation';
        break;
      case 'read':
        modal_title = 'View Reservation';
        children = <BookingCard booking={booking} fetchReservations={fetchReservations} />
        break;
      case 'update':
        modal_title = 'Edit Reservation';
        break;
      case 'delete':
        modal_title = 'Delete Reservation';
        break;
      case 'filter':
        children = <ReservationsFilterModal filters={filters} setFilters={setFilters} />;
        modal_title = 'Filters';
        break;
      default:
        children = <>Nahh wala</>;
    }
    setModal({ isOpen: true, variant, children, loading: false, title: modal_title });
  };


  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }



  // Table Filters

  const filteredReservation = reservations?.filter(reservation => {
    const statusMatch = !filters.status || reservation.status?.toLowerCase().includes(filters.status.toLowerCase());
    const usernameMatch = !filters.user_name || reservation.user_name?.toLowerCase().includes(filters.user_name.toLowerCase());
    return statusMatch && usernameMatch;
  }) || [];

  const totalPages = Math.ceil(filteredReservation.length / filters.paginate);
  const paginatedReservation = filteredReservation.slice((filters.page - 1) * filters.paginate, filters.page * filters.paginate);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [filters.paginate]);

  // useEffect(() => { console.log(filters) }, [filters]);

  const status_color = {
    Pending: 'text-orange-600',
    Confirmed: 'text-blue-600',
    Cancelled: 'text-red-600',
    Completed: 'text-green-600',
  };

  return (
    <div className={`bg-gray-50 lg:order-1 p-4`}>

      <Modal isOpen={modal.isOpen} onClose={closeModal} variant={modal.variant} title={modal.title} loading={modal.loading} children={modal.children}/* Here ang mga body sa imong modal */ onCancel={() => closeModal()} />
      {notify && (<ActionNotification isOpen={notify.open} variant={`${notify.type}`}> {notify.message} </ActionNotification>)}

      <div className={`sticky top-[4.5rem]`}>
        <div className={`flex justify-between items-center pb-4`}>
          <div className={``}>
            Filetered Date:{" "}
            {new Date(filters.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            to{" "}
            {new Date(filters.end_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div>
            Status: <span className={status_color[filters.status]}>{filters.status == null || filters.status == '' ? 'All' : filters.status}</span>
          </div>
        </div>
        <FilterAndActions filters={filters} setFilters={setFilters} openModal={openModal} input_filter={{ key_to_filter: 'user_name', placeholder: 'Username', create_label: 'New' }} />
        <Table theadings={['b_id', 'username', 'room_id', 'check_in', 'check_out', 'total_amount', 'status', 'actions']} isLoading={loading} containerRef={containerRef} >
          {filteredReservation.length > 0 ? (
            paginatedReservation.map((reservation, index) => (
              <TableData
                key={reservation.booking_id || index}
                columns={[
                  reservation.booking_id,
                  reservation.user_name,
                  reservation.room_id,
                  reservation.check_in,
                  reservation.check_out,
                  reservation.total_amount,
                  <span className={status_color[reservation.status]}>{reservation.status}</span>,
                  <ToggleDiv buttonText="Actions" containerRef={containerRef}>
                    <div className=" px-2 py-1 flex items-center hover:bg-gray-200 cursor-pointer" onClick={() => { openModal('read', reservation) }}> <LuEye className="size-5 mr-2" />View </div>
                    {/* <div className=" px-2 py-1 flex items-center text-orange-500 hover:bg-gray-200 cursor-pointer" onClick={() => { openModal('update', reservation) }}> <BiSolidEditAlt className="size-5 mr-2" />Edit </div> */}
                    {/* <div className=" px-2 py-1 flex items-center text-red-500 hover:bg-gray-200 cursor-pointer" onClick={() => { openModal('delete', reservation) }}> <MdOutlineDeleteForever className="size-5 mr-2" />Delete </div> */}
                  </ToggleDiv>
                ]}
              />
            ))
          ) : (
            <tr><td colSpan={7}><div className=" p-2 border border-gray-100">No {filters.status} Reservation found.</div></td></tr>
          )}
        </Table>

        <Pagination filters={filters} setFilters={setFilters} totalPages={totalPages} filtered={filteredReservation} />
      </div>
    </div>
  )
}

export default ReservationTables