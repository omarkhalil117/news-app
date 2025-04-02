/* eslint-disable react/prop-types */
import { createContext , useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    fullName: '',
    email: '' ,
    subs: new Set()
  });

  const addSource = (source) => {
    setUser((oldData) => {
      const newSubs = new Set(oldData.subs);
      newSubs.add(source);
      return {...oldData, subs: newSubs};
    })
  }

  const removeSource = (source) => {
    setUser((oldData) => {
      const newSubs = new Set(oldData.subs);
      newSubs.delete(source);
      return {...oldData, subs: newSubs};
    })
  }

  return (
    <UserContext.Provider value={{ user , setUser ,addSource ,removeSource }}>
      {children}
    </UserContext.Provider>
  );
};
