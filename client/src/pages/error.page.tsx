import { Link } from '@mui/material'


export default function ErrorPage({error}: {error?: Error}) {
  return (
    <div>
      <div>
        {/* <img src={OppsImag} className="px-12" /> */}
      </div>

      <h1>Aaaah! Something went wrong</h1>

      <div>
        <p>Brace yourself till we get the error fixed.</p>
        <p>You may also refresh the page or try again later</p>
        <Link href="#temas" underline='hover'>Home</Link>
      </div>

      <div>
        <h1>Sorry Something went wrong!!</h1>
        { process.env.NODE_ENV === "development" 
          ? <pre>{error?.message}</pre> 
          : <h1>Error code 500</h1>}
      </div>
    </div>
  )
}
