const Loader = ({ fullScreen = true }) => {
    const style = fullScreen
      ? { height: "100vh" }
      : { height: "100px" };
  
    return (
      <div className="d-flex justify-content-center align-items-center" style={style}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  };
  
  export default Loader;
  