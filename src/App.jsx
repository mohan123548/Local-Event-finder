import { useMemo, useState } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';

const events = [
  {
    id: 1,
    title: 'Tokyo Neon Night Market',
    city: 'Tokyo',
    category: 'parties',
    date: 'May 30 • 10:00 PM',
    price: '$25',
    description: 'A vibrant evening of street food, music, and immersive light art.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Shoreditch Tech Summit',
    city: 'London',
    category: 'tech',
    date: 'June 5 • 9:00 AM',
    price: '$120',
    description: 'Connect with product leaders, builders, and investors in one day.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Montmartre Film & Wine',
    city: 'Paris',
    category: 'art',
    date: 'June 2 • 7:30 PM',
    price: '$15',
    description: 'An intimate rooftop screening paired with curated wines and cheese.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Mission Garden Co-op',
    city: 'San Francisco',
    category: 'community',
    date: 'May 31 • 10:00 AM',
    price: 'Free',
    description: 'Join a hands-on gardening day that supports local urban farming.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80',
  },
];

const categories = ['all', 'parties', 'tech', 'art', 'community'];

function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  const visibleEvents = useMemo(() => {
    if (activeCategory === 'all') {
      return events;
    }

    return events.filter((event) => event.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="app-shell">
      <Header />

      <main className="content">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">React-powered event discovery</p>
            <h1>Discover local and global experiences in one polished feed.</h1>
            <p className="hero-copy">
              This starter React view keeps your GatherGo concept intact while giving the app a scalable component structure.
            </p>
          </div>
        </section>

        <section className="filter-row" aria-label="Event categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'All events' : category}
            </button>
          ))}
        </section>

        <section className="events-grid">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
