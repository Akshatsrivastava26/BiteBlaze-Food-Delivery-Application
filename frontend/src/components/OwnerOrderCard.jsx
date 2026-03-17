import React from 'react'

function OwnerOrderCard({data}) {
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <h2>{data.user.fullname}</h2>
      
    </div>
  )
}

export default OwnerOrderCard
