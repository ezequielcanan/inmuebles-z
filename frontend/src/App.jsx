import Router from './router/Router'
import UserContextProvider from "./context/UserContext"

const App = () => {
  return <UserContextProvider>
    <Router/>
  </UserContextProvider>
}

export default App