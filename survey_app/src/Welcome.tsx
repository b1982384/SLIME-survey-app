import { useNavigate } from 'react-router-dom'
import './Welcome.css'  // Import your CSS file

const WelcomePage = () => {
const navigate = useNavigate()
  return (
    <div className = "welcome-container">
      <header className = "welcome-header">
        <h1 className="welcome-title">Welcome!</h1>
      </header>
      <main className  = "welcome-main">
        <p className = "welcome-description">Welcome to this SLIME survey application. 
        </p>
      </main>
      <img 
        className="welcome-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Northwestern_University_seal.svg/1200px-Northwestern_University_seal.svg.png"
        alt="Northwestern University Logo" 
        width="300" 
        height="300"
      />
        <button className = "take-test" onClick= {() => navigate('/question')}>Take Survey</button>
       <p className = "about-header">About
       </p>
       <p className = "about-text">Technology has long shaped musical life: 
        from the three-minute track standard imposed by vinyl, to iTunes and the age of piracy, to today’s streaming platforms and recommendation algorithms [1].
         Features like autoplay, smart shuffle, and personalized playlists structure how people discover, organize, and consume music. These tools not only mediate access but also shape how listeners conceptualize control, novelty, and musical identity in an algorithmically augmented age. Music listening is now a
          multidimensional experience: it is not simply whether one streams, but how algorithmic systems structure discovery, curation, and everyday engagement. How do we study these complexities? Existing measures of musical engagement, such as the Gold-MSI [2] or AIMS [3], assume a single dimension, e.g., 
          treating engagement as a unitary, stable trait. While foundational, these scales overlook the technological and social dimensions of contemporary listening, where algorithmic tools, norms, and pressures play a defining role. To address this gap, we call for a combined approach, combining musicological frameworks designed to capture latent cultural and experiential constructs, 
          with HCI methods that capture technological dimensions [4, 5] such as agency, affordability, and trust. We present a preliminary self-report instrument, to be paired with a confirmatory behavioral sandbox study in future work, and results from an exploratory factor analysis (n=130), which yielded 8 factors of contemporary listener engagement, including algorithmic trust and aversion, curation, sociality, openness to exploration, 
          preference for control, susceptibility to conformity.
         </p>
         <p className = "Big-header">Take the 24 question survey to learn your listening identity!
         </p>
         <button className = "take-test" onClick= {() => navigate('/question')}>Take Survey</button>
    </div>
  );
}


export default WelcomePage;
