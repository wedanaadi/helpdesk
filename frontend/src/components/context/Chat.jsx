import { createContext, useContext, useState } from "react";
import useSWR, {useSWRConfig} from "swr"
import axios from '../util/jsonApi'

export const globalToken = createContext()

export const useNotifikasi = () => {
  return useContext(globalToken)
}


const fetcher = async () => {
  const lokalUser = JSON.parse(localStorage.getItem('userData'))
  const response = await axios.get('/notifikasi',{
    params: {
      id:lokalUser.idUser,
    }
  });
  return response.data
}

const NotifikasiContext = ({children}) => {
  const [notif, setNotif] = useState('ini token awal');
  const {data} = useSWR('notifikasi',fetcher)
  const {mutate} = useSWRConfig()
  return (<globalToken.Provider value={{ notif, setNotif, data, mutate  }}>
    {children}
  </globalToken.Provider>)
}

export default NotifikasiContext
