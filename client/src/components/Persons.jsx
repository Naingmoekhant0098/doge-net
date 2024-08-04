import React from 'react'
import User from './User';
import { useSelector } from 'react-redux';

const Persons = ({people,setPeople}) => {
  
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <div className=" mt-6 flex flex-col">
        {people?.length > 0 ? (
          people?.map((user,i) => {
            return (
              people?._id !== currentUser?._id && (
                <User  user={user} users={people} setUsers={setPeople} />
              )
            );
          })) : (<h4 className=' text-center text-white text-opacity-70'>Results not found !</h4>)}
      </div>
    </div>
  )
}

export default Persons