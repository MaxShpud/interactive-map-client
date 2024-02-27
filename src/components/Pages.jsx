import SighUp from './auth/SighUpForm.jsx'
import SignIn from './auth/SignInForm.jsx'
import Home from './Home.jsx'
import Account from './Account.jsx'

const BuildPage = (index) => (
    index  
)

export const PageLogin = ({theme, setTheme}) => BuildPage(<SignIn theme={theme} setTheme={setTheme}/>)
export const PageRegister = ({theme, setTheme}) => BuildPage(<SighUp theme={theme} setTheme={setTheme}/>)
export const PageHome = ({theme, setTheme}) => BuildPage(<Home theme={theme} setTheme={setTheme}/>)
export const PageAccount = ({theme, setTheme}) => BuildPage(<Account theme={theme} setTheme={setTheme}/>)