import { Link } from "react-router-dom"

const Home = () => {

  return (
    <>
      <h1>Hello</h1>
      <h4>Where would you like to go?</h4><br />
      <div>
        <a href="/signup"><button>Go to SignUp</button></a>
        <a href="/login"><button >Go to Login</button></a>
      </div>
    </>
  )
}

export default Home