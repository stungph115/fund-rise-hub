import './App.css';
import NotificationWindows from './NotificationWindows';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AppRoutes from './components/Routes';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <NotificationWindows />
    </div>
  );
}

export default App;
