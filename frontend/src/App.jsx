import { useEffect, useState } from "react";
import "./App.css";
import image1 from "./assets/team_pic.webp"
import laneLeft from "./assets/lane-left.png";
import laneRight from "./assets/lane-right.jpg";



const donationUrl =
  "https://www.westernconnect.ca/site/SPageNavigator/donation/giveAthletics.html";

function App() {
  const [selectedGender, setSelectedGender] = useState("men");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsByGender, setEventsByGender] = useState(null);
  const [unavailableEvent, setUnavailableEvent] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSelectedEvent, setAdminSelectedEvent] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [confirmedInstructions, setConfirmedInstructions] = useState(false);
  
  useEffect(() => {
    function fetchEvents() {
      fetch("https://mustangs-adopt-event.onrender.com/api/events")
        .then((response) => response.json())
        .then((data) => setEventsByGender(data))
        .catch(() => console.error("Could not load events"));
    }

    fetchEvents(); // initial load

    const interval = setInterval(fetchEvents, 60000); // every 60s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000); // updates every 30s

    return () => clearInterval(interval);
  }, []);

  if (!eventsByGender) {
    return <div className="app loading">Loading events...</div>;
  }

  const groups = eventsByGender[selectedGender];
  
  function getAlternativeEvents(eventItem) {
    const allEvents = groups.flatMap((group) => group.events);

    return allEvents
      .filter(
        (item) =>
          item.id !== eventItem.id &&
          item.status === "available"
      )
      .slice(0, 2);
  }

  function handleEventClick(eventItem) {
    if (eventItem.status !== "available") {
      setUnavailableEvent(eventItem);
      return;
    }

    setSelectedEvent(eventItem);
    setConfirmedInstructions(false);
  }

  function closeModal() {
    setSelectedEvent(null);
  }

  async function continueToDonate() {
    try {
      const response = await fetch(
        `https://mustangs-adopt-event.onrender.com/api/events/${selectedEvent.id}/reserve`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "This event is no longer available.");
        closeModal();
        return;
      }

      const updatedEvents = await fetch("https://mustangs-adopt-event.onrender.com/api/events");
      const updatedData = await updatedEvents.json();
      setEventsByGender(updatedData);

      window.open(donationUrl, "_blank");
      closeModal();
    } catch {
      alert("Could not reserve event. Please try again.");
    }
  }

  function getPendingText(eventItem) {
    if (eventItem.status !== "pending" || !eventItem.reservedUntil) {
      return eventItem.status;
    }

    const msRemaining = new Date(eventItem.reservedUntil) - now;
    const minutesRemaining = Math.max(0, Math.ceil(msRemaining / 60000));

    return `Pending confirmation`;
  }

  async function handleAdminAdopt(eventItem, donorName) {
    try {
      const response = await fetch(
        `https://mustangs-adopt-event.onrender.com/api/admin/adopt/${eventItem.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password: adminPassword,
            donorName: donorName
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const updated = await fetch("https://mustangs-adopt-event.onrender.com/api/events");
      const updatedData = await updated.json();
      setEventsByGender(updatedData);
    } catch {
      alert("Admin action failed");
    }
  }

  async function handleAdminAvailable(eventItem) {
    try {
      const response = await fetch(
        `https://mustangs-adopt-event.onrender.com/api/admin/available/${eventItem.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password: adminPassword })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const updated = await fetch("https://mustangs-adopt-event.onrender.com/api/events");
      const updatedData = await updated.json();
      setEventsByGender(updatedData);
    } catch {
      alert("Admin action failed");
    }
  }

  function getProgressStats() {
    const allEvents = Object.values(eventsByGender)
      .flat()
      .flatMap((group) => group.events);

    const total = allEvents.length;
    const adopted = allEvents.filter((event) => event.status === "adopted").length;
    const pending = allEvents.filter((event) => event.status === "pending").length;

    return { total, adopted, pending };
  }

  const progressStats = getProgressStats();
  const progressPercent = Math.round((progressStats.adopted / progressStats.total) * 100);

  return (
    <div className="app-wrapper">
      <div className="side-image side-image-left">
        <img src={laneLeft} alt="" />
      </div>

      <div className="side-image side-image-right">
        <img src={laneRight} alt="" />
      </div>
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Western Mustangs Swimming</p>
        <h1>Adopt An Event Fundraiser
        </h1>
        <p className="subtitle">
          Go above and beyond supporting Western Mustangs Swimming by adopting an
          event. All funds go directly towards supporting our athletes and
          program, helping us achieve our goals in and out of the pool.
        </p>
        
        {isAdmin && (
          <div className="admin-mode-badge">
            Admin Mode Active
            <button onClick={() => setIsAdmin(false)}>Exit</button>
          </div>
        )}
      </header>
      <img src={image1} alt="banner" className="hero-image" />
      <main className="catalogue">
        {new URLSearchParams(window.location.search).get("admin") === "true" && !isAdmin && (
          <section className="admin-login">
            <input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />

            <button
              onClick={() => {
                if (adminPassword === "Pickles123!") {
                  setIsAdmin(true);
                } else {
                  alert("Wrong password");
                }
              }}
            >
              Admin-only login
            </button>
          </section>
        )}
        <section className="coach-message">
          <div className="coach-card">
            <h2>A Message from Head Coach Paul</h2>

            <p className="coach-text">
              (Placeholder message) On behalf of the Western Mustangs Swimming program, thank you for your
              support. Your contributions help provide our athletes with opportunities
              that go far beyond the pool — from training camps to competition travel
              and everything in between. Continued placholder placholder placholder placholder
              placholder placholder placholder placholder.
            </p>
            <p className="coach-signoff">
              Paul Midgley
            </p>
          </div>
        </section>
        <section className="progress-section">
          <div className="progress-header">
            <h2>Campaign Progress</h2>
            <p>
              {progressStats.adopted} / {progressStats.total} events adopted
              {progressStats.pending > 0 && ` • ${progressStats.pending} pending confirmation`}
            </p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </section>
        <section className="toggle-bar">
          <label htmlFor="gender-select">View events for  </label>
          <select className="toggle-select"
            id="gender-select"
            value={selectedGender}
            onChange={(event) => setSelectedGender(event.target.value)}
          >
            <option value="men">MEN</option>
            <option value="women">WOMEN</option>
          </select>
        </section>

        {groups.map((section) => (
          <section key={section.group} className="event-section">
            <h2>{section.group}</h2>

            <div className="event-grid">
              {section.events.map((eventItem) => (
                <article
                  key={eventItem.name}
                  className="event-card clickable"
                  onClick={() => {
                    if (isAdmin) {
                      setAdminSelectedEvent(eventItem);
                    } else {
                      handleEventClick(eventItem);
                    }
                  }}
                >
                  <h3>{eventItem.name}</h3>
                  <p>${eventItem.price}</p>
                  <span className={`status-badge ${eventItem.status}`}>
                    {getPendingText(eventItem)}
                  </span>
                  {eventItem.status === "adopted" && eventItem.donorName && (
                    <p className="donor-name">Adopted by {eventItem.donorName}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>{selectedEvent.name}</h2>
            <p className="modal-price">${selectedEvent.price}</p>

            <p className="modal-text">
              You are about to leave this page and continue to the official
              Western University donation form. <strong>Please read important donation instructions below.</strong>
            </p>

            <ul className="modal-list">
              <li>
                Individual events are <strong>$500</strong>
              </li>
              <li>
                Relay events are <strong>$1000</strong> using <strong>Other Amount</strong>
              </li>
              <li>Select <strong>Swimming</strong> as the area of support</li>
              <li>Complete your contact information accurately</li>
            </ul>

            <p className="modal-text">
              <strong>After </strong> completing your donation, please send a confirmation to <strong>tgrabosk@uwo.ca</strong> with
              <ul className="modal-list">
                <li>The event name "{selectedEvent.name}"</li>
                <li> A <strong>screenshot</strong> of your transaction summary</li>
                <li>The name you would like to be associated with the donation (e.g. "The Smith Family" or "Anonymous")</li>
              </ul> 
              We will reserve your event for 24 hours while we await confirmation. 
              Click <a href="https://youtu.be/KRLC7pxliDg" target="_blank">
                here
                </a> to download
              a video walkthrough if you require further clarification.
              On a separate note, Western will send you an official
              tax receipt shortly after your donation as well. Cheers!
            </p>
            <p><strong>DO NOT include screenshots of any credit card info!</strong>
            </p>
            <p>*****************************************************************</p>

            <div className="modal-actions">
              <label className="confirm-checkbox">
                <input
                  type="checkbox"
                  checked={confirmedInstructions}
                  onChange={(e) => setConfirmedInstructions(e.target.checked)}
                />
                I understand I must send a confirmation email to tgrabosk@uwo.ca after donating and include the event name
              </label>
              <button className="secondary-button" onClick={closeModal}>
                Cancel
              </button>
              <button className="primary-button" disabled={!confirmedInstructions} onClick={continueToDonate}>
                Continue to Donation Page
              </button>
            </div>
          </div>
        </div>
      )}

      {unavailableEvent && (
        <div className="modal-overlay" onClick={() => setUnavailableEvent(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>{unavailableEvent.name} is not available</h2>

            <p className="modal-text">
              This event is currently pending or has already been adopted. Please choose
              another available event below.
            </p>

            <div className="alternative-list">
              {getAlternativeEvents(unavailableEvent).map((eventItem) => (
                <button
                  key={eventItem.id}
                  className="alternative-button"
                  onClick={() => {
                    setUnavailableEvent(null);
                    handleEventClick(eventItem);
                  }}
                >
                  {eventItem.name} — ${eventItem.price}
                </button>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setUnavailableEvent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {adminSelectedEvent && (
        <div className="modal-overlay" onClick={() => setAdminSelectedEvent(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>Admin: {adminSelectedEvent.name}</h2>
            <p className="modal-text">
              Current status: <strong>{adminSelectedEvent.status}</strong>
            </p>
            <input
              className="donor-input"
              type="text"
              placeholder="Donor name, e.g. Smith Family"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setAdminSelectedEvent(null)}
              >
                Cancel
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  handleAdminAvailable(adminSelectedEvent);
                  setAdminSelectedEvent(null);
                }}
              >
                Mark as Available
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  handleAdminAdopt(adminSelectedEvent, donorName);
                  setAdminSelectedEvent(null);
                  setDonorName("");
                }}
              >
                Mark as Adopted
              </button>
            </div>
          </div>    
        </div>
      )}
    </div>
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-title">Western Mustangs Swimming</p>

        <p className="footer-text">
          Questions or donation confirmations?
        </p>

        <p className="footer-email">
          Email: <a href="mailto:tgrabosk@uwo.ca">tgrabosk@uwo.ca</a>
        </p>

        <p>Accidentally closed the offical page? Click <a href="https://www.westernconnect.ca/site/SPageNavigator/donation/giveAthletics.html">here</a></p>

        <p className="footer-note">
          Please include the event name in your message so we can confirm your adoption.
        </p>
        <p>________________________________________________________________________________</p>
      </div>
    </footer>
    </div>
  );
}

export default App;