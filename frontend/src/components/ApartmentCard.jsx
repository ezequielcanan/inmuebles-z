const ApartmentCard = ({apartment}) => {
  return (
    <div className={`${apartment.forSale ? "bg-fifth" : "bg-red-500"} flex flex-col items-center py-6 px-3 h-[250px] w-[200px]`}>
      <h2 className="text-4xl text-fourth">UF: {apartment.unit}</h2>
      <div className="flex flex-col text-xl text-fourth">
        <h3 className={apartment.rooms == "2 ambientes" ? "text-2xl" : undefined}>{apartment.rooms}</h3>
      </div>
    </div>
  )
}

export default ApartmentCard