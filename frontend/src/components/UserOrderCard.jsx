import React from 'react'
import { useNavigate } from 'react-router-dom';

function UserOrderCard({data}) {
  const navigate=useNavigate();
  const formatDate = (dateString) => {
    const date=new Date(dateString);
    return date.toLocaleDateString('en-GB',{
      day:'2-digit',
      month:'short',
      year:'numeric',
    });
  }
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <div className='flex justify-between border-b-pb-2'>
        {/* left side data */}
        <div>
          <p className='font font-semibold'>Order #{data._id.slice(-6)}</p>
          <p className='text-sm text-gray-500'>
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        {/* right side data */}
        <div className='text-right'>
          <p className='text-sm text-gray-500'>{data.paymentMethod?.toUpperCase()}</p>
          <p className='font-medium text-blue-600'>{data.shopOrders?.[0].status}</p>
        </div>

      </div>
      {/* mapping shop orders here */}
      {data.shopOrders?.map((shopOrder, index) => (
        <div className='border rounded-lg p-4' key={index}>
          <p>{shopOrder.shop.name}</p>
          {/* items will be shown here */}
          <div className='flex space-x-4 overflow-x-auto pb-2'> 
            {shopOrder.shopOrderItems?.map((item, index) => (
              <div key={index}className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                <img src={item.item.image} alt={item.name}  className='w-full h-24 object-cover rounded'/>
                <p className='text-sm font-semibold mt-1'>{item.name}</p>
                <p className='text-xs text-gray-500'>Qty: {item.quantity} x ₹{item.price} </p>
              </div>
            ))}
          </div>
          {/* left side price & right side status */}
          <div className='flex justify-between items-center border-t pt-2'>
            <p className='font-semibold'>Subtotal: ₹{shopOrder.subtotal}</p>
            <span className='text-sm font-medium text-blue-600'>{shopOrder.status}</span> 
          </div>
        </div>
      ))}

      {/* Grant Total */}
      <div className='flex justify-between items-center border-t pt-2'>
        <p className='font-semibold'>Total: ₹{data.totalAmount}</p>
        {/* Track Order Button */}
        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm cursor-pointer' onClick={()=>navigate(`/track-order/${data._id}`)}>Track Order</button>
      </div>
    </div>
  )
}

export default UserOrderCard
