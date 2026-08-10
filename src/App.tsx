import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Robots from './components/Robots';
import Outreach from './components/Outreach';
import Mentors from './components/Mentors';
import Footer from './components/Footer';
import { SeasonProvider } from './context/SeasonContext';

export default function App() {
  return (
    <SeasonProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <Robots />
        <Outreach />
        <Mentors />
      </main>
      <Footer />
    </SeasonProvider>
  );
}
