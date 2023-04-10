import background from './sunset_background.jpg';
import './App.css';

function App() {
  return (
    <div className="App" style={{backgroundImage: `url(${background})`}}>
      <header className="App-header">
        <img src={require('./headshot.jpg')} alt="headshot" style={{width:"20vw"}} />
        <p>
          Hanna Tuomi
        </p>
      </header>
    </div>
  );
}

export default App;
