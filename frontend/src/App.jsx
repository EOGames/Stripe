import AddCard from "./Pages/AddCard";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Main from "./Pages/Main";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <div className="App">

      <Main />
      {/* <Elements stripe={stripePromise}>
        <AddCard />
      </Elements> */}
    </div>
  );
}

export default App;
