import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Robots from './components/Robots';
import Outreach from './components/Outreach';
import Mentors from './components/Mentors';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Robots />
        <Outreach />
        <Mentors />
      </main>
      <Footer />
    </>
  );
}
