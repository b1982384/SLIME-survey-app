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
  <h2>Consent to Participate in Research</h2>
  <p><strong>Title of Research Study: <em>What Listening Device Are You?</em></strong></p>

  <p><strong>Principal Investigator:</strong> Daniel Shanahan</p>
  <p><strong>Student Investigators: </strong>Annie Chu, Benjamin Wong-Fodor, Katie Lam</p>

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
      You will be asked to complete three demographic questions (age, musical training, and use of
      streaming), followed by 24 questions related to your own listening habits.
      </li>
      <li>
      We expect that you will be in this research study for about 5-10 minutes.
      </li>
      <li>
      The primary potential risk of participation is responses about your listening behavior being
visible to others.
      </li>
      <li>
      The main benefit of being in this study is to better understand your own listening practice in
      relation to those of others.
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
  After consenting to participation, you will be presented asked one brief question about your musical 
  training. After this, you will be asked a few short demographic questions (age, musical training, and
how often you stream music). You will then be asked 24 questions about your listening habits. We
anticipate that this will take between 5-10 minutes. You will be provided with the option to share
your results to social media. We hope that this will provide visibility for this study, but it is entirely
optional.
  </p>

  <h3>Will being in this study help me in any way?  </h3>
  <p>
  We cannot promise any benefits to you or others from your taking part in this research. However, possible benefits include gaining a better understanding of how you listen to and respond to musical patterns.
  </p>

  <h3>Is there any way being in this study could be bad for me? </h3>
  <p>
  A possible risk for any research is that confidentiality could be compromised – that is, that people outside the study might get hold of confidential study information.  We will do everything we can to minimize this risk, as described in more detail later in this form.
  </p>


  <h3>What happens if I do not want to be in this research, or I change my mind later?  </h3>
  <p>
  Participation in research is voluntary. You can decide to participate or not to participate.  If you do not want to be in this study or withdraw from the study at any point, your decision will not affect your relationship with Northwestern University. </p>
   <p>You can leave the research at any time and it will not be held against you.</p>
    <p>If you decide to withdraw from this study, any data already collected from you will be destroyed.</p>

  <h3>How will the researchers protect my information? </h3>
  <p>
  Data from the study are written to a secure Amazon server is password protected with multi-factor authentication, and is maintained by the study investigators. Data are fully encrypted and all identifiable information is stored separately from data collected in the study. 
  </p>

  <h3>Who will have access to the information collected during this research study?  </h3>
  <p>
  Efforts will be made to limit the use and disclosure of your personal information, including research study records, to people who have a need to review this information. We cannot promise complete secrecy. 
There are reasons why information about you may be used or seen by other people beyond the research team during or after this study.   Examples include:
  </p>
  <ul>
    <li>
    University officials, government officials, study funders, auditors, and the Institutional Review Board may need access to the study information to make sure the study is done in a safe and appropriate manner
    </li>
  </ul>

  <h3>How might the information collected in this study be shared in the future?
  </h3>
  <p>
  We will keep the information we collect about you during this research study for study recordkeeping. Your name and other information that can directly identify you will be stored securely and separately from the rest of the research information we collect from you.   </p>
<p> De-identified data from this study may be shared with the research community, with journals in which study results are published, and with databases and data repositories used for research. We will remove or code any personal information that could directly identify you before the study data are shared. Despite these measures, we cannot guarantee the anonymity of your personal data.  </p>
<p> The results of this study could be shared in articles and presentations, but will not include any information that identifies you. 
  </p>


  <h3>Will I be paid or given anything for taking part in this study?
  </h3>
  <p>
  You will not receive any compensation for taking part in this study. 
  </p>

  <h3>Who can I talk to?
  </h3>
 <p>
 If you have questions, concerns, or complaints, you can contact the Principal Investigator Daniel Shanahan (Daniel.shanahan@northwestern.edu). </p>
<p>This research has been reviewed and approved by an Institutional Review Board (“IRB”) – an IRB is a committee that protects the rights of people who participate in research studies. You may contact the IRB by phone at (312) 503-9338 or by email at irb@northwestern.edu if: </p>
<ul>
  <li>
  Your questions, concerns, or complaints are not being answered by the research team.
  </li>
  <li>
  You cannot reach the research team.
  </li>
  <li>
  You want to talk to someone besides the research team.
  </li>
  <li>
  You have questions about your rights as a research participant.
  </li>
  <li>
  You want to get information or provide input about this research.
  </li>
</ul>

  
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
