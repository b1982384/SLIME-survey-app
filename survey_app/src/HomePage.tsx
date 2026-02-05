/* eslint-disable no-irregular-whitespace */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);

  const handleTakeSurvey = () => {
    if (!consentGiven) {
      setShowConsentError(true);
      return;
    }
  
    navigate('/question');
  };
  
  return (
    <div className="home-container">
      <div className="welcome-banner">Welcome!</div>
      <p className="home-text">
        Thank you for visiting our study. Before starting the survey, please review the consent
        information below.
      </p>

      <div className="consent-section">
      <div className="consent-text">
  <h2>Title of Research Study</h2>
  <p><strong>What Listening Device Are You?</strong></p>

  <p><strong>Principal Investigator:</strong> Daniel Shanahan</p>
  <p><strong>Student Investigators:</strong> Annie Chu, Benjamin Wong-Fodor, Katie Lam</p>

  <p><strong>Supported By:</strong> This research is supported by the Bienen School of Music at Northwestern University.</p>

  <h3>Key Information about this Research Study</h3>
  <p>
    The following is a short summary of this study to help you decide whether to be a part of this study.
    More detailed information is explained later in this form.
  </p>

  <ul>
    <li>
      The purpose of this study is to examine listening habits in streamed listening environments.
    </li>
    <li>
      You will be asked to complete three demographic questions (age, musical training, and use of streaming),
      followed by 24 questions related to your own listening habits.
    </li>
  </ul>

  <h3>Why am I being asked to take part in this research study?</h3>
  <p>
    We are asking you to take part in this research study because you are between the ages of 18–65,
    are located within the United States, have no known hearing or vision problems,
    and have access to headphones.
  </p>

  <h3>How many people will be in this study?</h3>
  <p>
    We expect about 800 people will participate in this research study.
  </p>

  <h3>What should I know about participating in a research study?</h3>
  <ul>
    <li>Whether or not you take part is up to you.</li>
    <li>You can choose not to take part.</li>
    <li>You can agree to take part and later change your mind.</li>
    <li>Your decision will not be held against you.</li>
    <li>You can ask any questions you want before you decide.</li>
    <li>You do not have to answer any question you do not want to answer.</li>
  </ul>

  <h3>What happens if I say, “Yes, I want to be in this research”?</h3>
  <p>
    After consenting to participate, you will first be asked one brief question about your musical training.
    You will then be asked a few short demographic questions (age, musical training, and how often you stream music),
    followed by 24 questions about your listening habits.
  </p>
</div>

        <label className="consent-checkbox">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
          />{' '}
          I consent to participate in this survey
        </label>

        {showConsentError && !consentGiven && (
          <p className="consent-error">Please give consent to continue.</p>
        )}
      

        <button className="take-survey-button" onClick={handleTakeSurvey}>
          Take Survey
        </button>
      </div>

  
    </div>
  );
};

export default HomePage;
