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
        <p className="consent-text">
        Title of Research Study: What Listening Device Are You?
Principal Investigator: Daniel Shanahan
Student Investigators: Annie Chu, Benjamin Wong-Fodor, Katie Lam

Supported By: This research is supported by the Bienen School of Music at Northwestern University.
Key Information about this research study:
The following is a short summary of this study to help you decide whether to be a part of this study. Information that is more detailed is explained later on in this form.

  *   The purpose of this study is to examine listening habits in streamed listening environments.
  *   You will be asked to complete three demographic questions (age, musical training, and use of streaming), followed by 24 questions related to your own listening habits.

 Why am I being asked to take part in this research study?

We are asking you to take part in this research study because you are between the ages of 18-65, are located within the United States, have no known hearing or vision problems, and have access to headphones.
How many people will be in this study?
We expect about 800 people will be in this research study.
What should I know about participating in a research study?

  *   Whether or not you take part is up to you.
  *   You can choose not to take part.
  *   You can agree to take part and later change your mind.
  *   Your decision will not be held against you.
  *   You can ask all the questions you want before you decide.
  *   You do not have to answer any question you do not want to answer.



What happens if I say, “Yes, I want to be in this research”?



After consenting to participation, you will be presented asked one brief question about your musical training. After this, you will be asked a few short demographic questions (age, musical training, and how often you stream music). You will then be asked 24 questions about your listening habits.
        </p>

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
