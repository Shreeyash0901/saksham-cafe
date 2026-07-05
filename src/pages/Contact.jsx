import "./Contact.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";

export default function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-container">

        <div className="contact-header">
          <p className="contact-subtitle">Visit Us</p>

          <h1>SAKSHAM Café</h1>

          <p>
            Experience delicious pure vegetarian food, refreshing beverages,
            and a cozy atmosphere with your friends and family.
          </p>
        </div>

        <div className="contact-grid">

          {/* Address */}
          <div className="contact-card">
            <FaMapMarkerAlt className="contact-icon" />

            <h3>Our Location</h3>

            <p>
              Adarsh College - Akola Bypass Road,
              <br />
              Mauli Nagar,
              <br />
              Ramakrishna Nagar,
              <br />
              Balsond,
              <br />
              Hingoli, Maharashtra 431513
            </p>

            <a
              href="https://maps.google.com/?q=SAKSHAM+Cafe+Hingoli"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Phone */}
          <div className="contact-card">
            <FaPhoneAlt className="contact-icon" />

            <h3>Call Us</h3>

            <p>+91 97672 26000</p>

            <a
              href="tel:+919767226000"
              className="contact-btn"
            >
              Call Now
            </a>
          </div>

          {/* Timing */}
          <div className="contact-card">
            <FaClock className="contact-icon" />

            <h3>Opening Hours</h3>

            <p>
              Monday – Sunday
              <br />
              10:00 AM – 11:00 PM
            </p>

            <p style={{ marginTop: "10px", color: "#00f5ff" }}>
              Pure Vegetarian Café
            </p>
          </div>

        </div>

        {/* Google Map */}
        <div className="map-section">
          <iframe
            title="SAKSHAM Café Location"
            src="https://www.google.com/maps?q=SAKSHAM+Cafe+Hingoli&output=embed"
            loading="lazy"
            allowFullScreen
          />
        </div>

      </div>
    </main>
  );
}