import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { supabase } from './supabaseClient';


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const [Age, setAge] = useState("");
  const [SinglePredicter, setSinglePredicter] = useState("");
  
  const handleTakeSurvey = () => {
    if (!consentGiven) {
      setShowConsentError(true);
      return;
    }
  
    if (!Age || !SinglePredicter) {
      alert("Please select your age and musician title before continuing.");
      return;
    }
  
    // send values to the questions page
    navigate('/question', { state: { Age, SinglePredicter } });
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
          By continuing, you acknowledge that your responses are voluntary and may be used for
          research purposes. Your answers will remain confidential and anonymized. Please indicate
          your consent below to continue. For questions, concerns, or complaints, contact Principal Investigator Matthew Groh at matthew.groh@kellogg.northwestern.edu. 
          This study is IRB-approved; you may also contact the IRB at (312) 503-9338 or irb@northwestern.edu if your 
          questions are not answered by the research team, you cannot reach them, you want to talk to someone else, or you have questions about your rights as a participant
          he purpose of this study is to evaluate how people perceive voices that may be generated or modified by artificial intelligence. We will present audio clips and ask you to identify whether you think the clips match the same speaker or different speakers. This research may provide insights into how AI-generated voices affect our perception of identity and contribute to future guidelines or policies on digital voice replication.
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
          
          <div className = "age-dropdown">
            <select value={Age} onChange = {(event) => setAge(event.target.value)}>
              <option value="" disabled hidden>What is your age?</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65+">65+</option>
              <option value="Decline">Prefer not to say</option>
            </select>
          </div>
          <div className = "predictor-dropdown">
            <select value={SinglePredicter} onChange={(event) => setSinglePredicter(event.target.value)}>
              <option value = "" disabled hidden>Which title best describes you?</option>
              <option value="Nonmusician">Nonmusician</option>
              <option value="Music-loving nonmusician">Music-loving nonmusician</option>
              <option value="Amateur musician">Amateur musician</option>
              <option value="Serious amateur musician">Serious amateur musician</option>
              <option value="Semi-professional musician">Semi-professional musician</option>
              <option value="Professional musician">Professional musician</option>
            </select>
          </div>
        <button className="take-survey-button" onClick={handleTakeSurvey}>
          Take Survey
        </button>
      </div>

  
    </div>
  );
};

export default HomePage;
