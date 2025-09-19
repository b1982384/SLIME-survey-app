import { useNavigate } from 'react-router-dom';
import './Welcome.css'; // Import your CSS file
import { useState } from 'react';

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'consent'>('welcome'); // State for active tab
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'welcome' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('welcome')}
        >
          Welcome
        </button>
        <button
          className={`tab-button ${activeTab === 'consent' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('consent')}
        >
          Consent
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'welcome' && (
        <div>
          <div className="Welcome-banner">Welcome!</div>
          <div className="advertise-banner">
            Take our 24-question survey to find out your listener profile!
          </div>
          <div className="about-section">
            <div className="about-logo">
              <img
                className="welcome-logo"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Northwestern_University_seal.svg/1200px-Northwestern_University_seal.svg.png"
                alt="Northwestern University Logo"
                width="250"
                height="250"
              />
            </div>
            <div className="about-content">
              <div className="about-header">About</div>
              <p className="about-text">
                The purpose of this study is to examine how music listening behaviors have shifted in
                response to the increasing influence of algorithmic features on music streaming
                platforms. As recommendation systems and AI-driven tools like autoplay, smart shuffle,
                and algorithmically-curated personalized playlists become more embedded in daily music
                use, it is important to understand how listeners interact with these features and how
                they shape discovery, organization, and consumption patterns. This research seeks to
                explore how often and in what ways users rely on algorithmic recommendations, what
                strategies they use to find and organize music, and how they perceive the accuracy and
                usefulness of these systems. A central goal is to examine how different aspects of
                listening behavior—such as frequency, discovery methods, playlist curation, and format
                preferences—correlate.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'consent' && (
        <div className="consent-section">
          <div className="consent-header">Consent</div>
          <p className="consent-text">
            By continuing, you acknowledge that your responses are voluntary and may be used for
            research purposes. Your answers will remain confidential and anonymized. Below is a link
            to a full consent form with more details.
          </p>

          <label className="consent-checkbox">
            <input
              type="checkbox"
              onChange={(e) => setConsentGiven(e.target.checked)}
            />{' '}
            I consent to participate in this survey
          </label>

          {showConsentError && !consentGiven && (
            <p className="consent-error">Please give consent to continue.</p>
          )}

          <button
            className="take-test"
            onClick={() => {
              if (!consentGiven) {
                setShowConsentError(true);
                return;
              }
              navigate('/question');
            }}
          >
            Take Survey
          </button>
        </div>
      )}
    </div>
  );
};


export default WelcomePage;