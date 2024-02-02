export default function UnderTheMaintenance({message}: {message?: string}) {
  const remaining_time = message?.match(/\((\d+)sec.\)/)?.[1]

  return (
    <div>
      <div>
        {/* <img src={OppsImag} className="px-12" /> */}
      </div>

      <h1>The site is currently down for maintenance</h1>

      <div>
        <h3>{message}</h3>
        <h1>Refresh after: {remaining_time} secounds</h1>
      </div>
    </div>
  )
}

