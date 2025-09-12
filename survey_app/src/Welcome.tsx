import { useNavigate } from 'react-router-dom'
import './Welcome.css'  // Import your CSS file

const WelcomePage = () => {
 
const navigate = useNavigate()
  return (
    <div className = "welcome-container">
      <div className = "Welcome-banner">Welcome</div>
      <div className="about-section">
  <div className="about-logo">
  <img 
  className="welcome-logo"
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Northwestern_University_seal.svg/1200px-Northwestern_University_seal.svg.png"
  alt="Northwestern University Logo" 
  width="300" 
  height="300"
  />
  </div>
  <div className="about-content">
    <div className="about-header">About</div>
    <p className="about-text">
    The purpose of this study is to examine how music listening behaviors have shifted in response to the increasing influence of algorithmic features on music streaming platforms. As recommendation systems and AI-driven tools like autoplay, smart shuffle, and algorithmically-curated personalized playlists become more embedded in daily music use, it is important to understand how listeners interact with these features and how they shape discovery, organization, and consumption patterns.
    This research seeks to explore how often and in what ways users rely on algorithmic recommendations, what strategies they use to find and organize music, and how they perceive the accuracy and usefulness of these systems. A central goal is to examine how different aspects of listening behavior—such as frequency, discovery methods, playlist curation, and format preferences—correlate with the use of algorithmic features on streaming platforms.

    </p>
  </div>
</div>

<div className="consent-section">
  <div className="consent-header">Consent</div>
  <p className="consent-text">
    By continuing, you acknowledge that your responses are voluntary and may be used for research purposes.
    Your answers will remain confidential and anonymized. Below is a link to a full consent form with more deatils.
  </p>
  
  <label className="consent-checkbox">
    <input type="checkbox" /> I consent to participate in this survey
  </label>
  <button onClick={() => navigate('/question')} className="take-test">Take Survey</button>

</div>

    </div>
  );
}


export default WelcomePage;
