import "./App.css";
import { arrayAJsonCV } from './services/services';

function App() {
  arrayAJsonCV(require("./fuentes/GV.json"))
  return (
    <div>
      <h1>HOLA</h1>
    </div>
  );
}

export default App;
