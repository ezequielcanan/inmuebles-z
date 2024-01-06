const Main = ({children, className}) => {
  return (
    <main className={"min-h-screen flex flex-col px-20 " + className}>
      {children}
    </main>
  )
}

export default Main