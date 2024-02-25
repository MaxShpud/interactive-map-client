import Register from './Register'
import Login from './Login'
import Home from './Home'

const BuildPage = (index) => (
    index  
)

export const PageLogin = () => BuildPage(<Login/>)
export const PageRegister = () => BuildPage(<Register/>)
export const PageHome = () => BuildPage(<Home/>)