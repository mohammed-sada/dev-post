const Loader = ({ fullPage = false }) => {
  let circleCommonClasses = 'h-2.5 w-2.5 bg-current rounded-full';
  let styles;
  if (fullPage) {
    styles = 'flex justify-center items-center h-screen';
    circleCommonClasses = 'h-8 w-8 bg-current rounded-full';
  } else {
    styles = 'flex';
  }
  return (
    <div className={styles}>
      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
};

export default Loader;
