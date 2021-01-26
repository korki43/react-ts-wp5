interface Props {}

const App: React.FC<Props> = () => {
  return (
    <>
      <h1>React App!</h1>
      <p>Version {process.env.APP_VERSION}</p>
    </>
  );
};

export default App;
