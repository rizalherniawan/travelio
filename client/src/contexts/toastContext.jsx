import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

function ToastProvider({children}) {
  const [toast, setToast] = useState({
    open: false, 
    msg: '',
  });

  return (
    <ToastContext.Provider value={{toast, setToast}}>
      {children}
    </ToastContext.Provider>
  )
}

const useToast = () => useContext(ToastContext);

export { ToastContext, ToastProvider, useToast}