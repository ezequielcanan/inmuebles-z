import { Link } from "react-router-dom"

const ApartmentCard = ({apartment, className, edit=false}) => {
  return (
    <Link to={`/inmueble/${apartment._id}${edit ? "/edit" : ""}`} className={`${apartment.forSale ? "bg-fifth" : "bg-red-500"} flex flex-col items-center py-6 px-3 h-[250px] w-[200px] ${className}`}>
      <h2 className="text-4xl text-fourth">UF: {apartment.unit}</h2>
      <div className="flex flex-col text-xl text-fourth items-center gap-y-[40px]">
        <h3 className={apartment.rooms == "2 ambientes" ? "text-2xl" : undefined}>{apartment.rooms}</h3>
        <span className={`${apartment.rent ? "rounded-full bg-[#fcba03] w-[80px] h-[80px]" : "hidden"}`}></span>
      </div>
    </Link>
  )
}

export default ApartmentCard