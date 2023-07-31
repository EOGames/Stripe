import AddCard from "./Pages/AddCard";
import Main from "./Pages/Main";
import { useRef } from "react";


function App() {
  const email = useRef('');

  const getEmail = ()=>
  {
    return email.current.value;
  }
  return (
    <div className="App">
      <div style={{display:'flex',justifyContent:'center'}}>
        <input ref={email} type="text" placeholder="email" style={{ height: '40px', outline: 'none', marginTop: '5px',width:'300px' }} />
      </div>
      <Main getEmail={getEmail} />
     
    </div>
  );
}

export default App;
