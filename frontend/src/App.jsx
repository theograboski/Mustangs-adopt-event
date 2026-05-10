import { useEffect, useState } from "react";
import "./App.css";
import image1 from "./assets/team_pic.webp"
import laneLeft from "./assets/lane-left.png";
import laneRight from "./assets/lane-right.jpg";



const donationUrl =
  "https://www.westernconnect.ca/site/SPageNavigator/donation/giveAthletics.html?designee=2531&s_src=WB&s_subsrc=FY2526MAYATHQ1OMWBMUSXXXALOW1&utm_source=web&utm_medium=mustangs&utm_campaign=organic&utm_id=ath_25";

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
        <h1 className = "h1-color">Adopt An Event Fundraiser
        </h1>
        <p className="subtitle">
          <br></br>Go above and beyond supporting Western Mustangs Swimming by adopting an
          event. The Mustangs Adopt an Event initiative gives you the opportunity to sponsor an event of your choice,
          with all funds going directly towards supporting our athletes.<br></br><br></br>
          Events can be sponsored by an individual, or a group of sponsors. 
          All event sponsors will be recognized through web publications, a donation board being posted on the pool deck, 
          in physical events programs, and through name announcements at championship meets.
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
              Dear Western Swimming Parents, Alumni, and Supporters <br></br><br></br>
              On behalf of the Western Mustangs Varsity Swim Team, I would like to extend a sincere thank you for your continued support of our program.
              A successful varsity program is built on more than hard work and training hours alone. The generosity of our donors helps to provide opportunities and resources that allow our swimmers to represent Western at the highest level. Your support directly contributes to our training camps, recruiting, scholarships, and championship experiences that strengthen our program and support our student-athletes.
              <br></br><br></br>The Mustang Adopt an Event initiative is a meaningful way to invest in the future of our program as we prepare to host the 2027 Merrily Stratten Divisional Championships. Your support will make a lasting difference for our athletes and for Western Swimming as a whole.
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
            <h2 className = "h1-color">{selectedEvent.name}</h2>
              <h4 className="western-record">
                ⚡⚡⚡ Western Record: <strong>{selectedEvent.westernRecord}</strong>
                {selectedEvent.recordHolder && <> by {selectedEvent.recordHolder}</>}
                {selectedEvent.recordYear && <>, {selectedEvent.recordYear}</>} ⚡⚡⚡
              </h4>
            <p className="modal-price">${selectedEvent.price}</p>

            <p className="modal-text">
              You are about to leave this page and continue to the official
              Western University donation form. <strong>Please read important donation instructions below.</strong>
            </p>

            <ul className="modal-list">
              <li>
                This event costs $<strong>{selectedEvent.price}</strong>
              </li>
              <li>The area of support should be <strong>swimming</strong></li>
              <li>Complete your contact information accurately so Western can send you a tax receipt!</li>
            </ul>

            <p className="modal-text">
              <strong className = "just-color">After completing your donation, please send a confirmation to tgrabosk@uwo.ca</strong> that includes the following:
              <ul className="modal-list">
                <li>The event name "{selectedEvent.name}"</li>
                <li> A <strong>screenshot</strong> of your transaction summary</li>
                <li>The name you would like to be associated with the donation (e.g. "The Smith Family" or "Anonymous")</li>
              </ul> 
              We will reserve your event for 24 hours while we await confirmation. 
              Click <a href="https://youtu.be/KRLC7pxliDg" target="_blank" className = "link-color">
                here
                </a> to view
              a video walkthrough if you require further clarification. Note that this single purchase gives you ownership of the event
              for 2 full years!
            </p>
            <p><strong>DO NOT include screenshots of any credit card info!</strong>
            </p><br></br>

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
            <h2 className = "h1-color">{unavailableEvent.name} is not available</h2>

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
            <h2 className = "h1-color">Admin: {adminSelectedEvent.name}</h2>
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
        <p className="footer-title"><br></br>Western Mustangs Swimming</p>

        <p className="footer-text">
          Questions or donation confirmations?
        </p>

        <p className="footer-email">
          Email: <a href="mailto:tgrabosk@uwo.ca" className = "link-color">tgrabosk@uwo.ca</a>
        </p>

        <p>Accidentally closed the offical page? Click <a href="https://www.westernconnect.ca/site/SPageNavigator/donation/giveAthletics.html?designee=2531&s_src=WB&s_subsrc=FY2526MAYATHQ1OMWBMUSXXXALOW1&utm_source=web&utm_medium=mustangs&utm_campaign=organic&utm_id=ath_25" className = "link-color">here</a></p>

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