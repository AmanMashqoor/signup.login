import { Link } from "react-router-dom"

const Home = () => {

  return (
    <>
      <h1>Hello</h1>
      <h4>Where would you like to go?</h4><br />
      <div>
        <Link to="/signup"><button>Go to SignUp</button></Link>
        <Link to="/login"><button >Go to Login</button></Link>
      </div>
    </>
  )
}

export default Home