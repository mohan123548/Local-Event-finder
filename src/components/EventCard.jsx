function EventCard({ event }) {
  return (
    <article className="event-card">
      <img src={event.image} alt={event.title} />
      <div className="event-card__content">
        <div className="event-card__meta">
          <span>{event.city}</span>
          <span>{event.price}</span>
        </div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-card__footer">
          <span>{event.date}</span>
          <button className="secondary-btn">View details</button>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
