import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Revolutionary Next-Gen UI Design System
const styles = {
  container: {
    minHeight: '100vh',
    background: `
      linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0a0a0a 100%),
      radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    color: '#ffffff'
  },

  // Animated background particles
  particleLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
    background: `
      radial-gradient(2px 2px at 20px 30px, rgba(0, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255, 0, 128, 0.3), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(0, 255, 128, 0.3), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255, 128, 0, 0.3), transparent)
    `,
    backgroundSize: '200px 100px, 180px 120px, 220px 90px, 160px 110px',
    animation: 'particleFloat 20s linear infinite'
  },

  // Glassmorphism navbar
  navbar: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '15px 30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#00ffff'
  },

  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #00ffff, #ff0080)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    animation: 'logoGlow 2s ease-in-out infinite alternate'
  },

  navStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0, 255, 255, 0.1)',
    padding: '8px 16px',
    borderRadius: '25px',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    fontSize: '0.85rem',
    fontWeight: '600'
  },

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff80',
    boxShadow: '0 0 10px #00ff80',
    animation: 'pulse 2s ease-in-out infinite'
  },

  // Hero section with holographic effect
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    padding: '0 20px'
  },

  heroTitle: {
    fontSize: 'clamp(3rem, 8vw, 8rem)',
    fontWeight: '900',
    marginBottom: '30px',
    background: `
      linear-gradient(
        45deg,
        #00ffff 0%,
        #ff0080 25%,
        #00ff80 50%,
        #8000ff 75%,
        #00ffff 100%
      )`,
    backgroundSize: '400% 400%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'holographicShift 4s ease-in-out infinite',
    textShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
    lineHeight: '0.9',
    letterSpacing: '-0.02em'
  },

  heroSubtitle: {
    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    fontWeight: '300',
    marginBottom: '20px',
    color: '#ffffff',
    opacity: 0.9,
    letterSpacing: '0.05em'
  },

  heroDescription: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '600px',
    lineHeight: '1.6',
    marginBottom: '50px'
  },

  // Futuristic CTA button
  heroButton: {
    background: 'linear-gradient(135deg, #00ffff, #ff0080)',
    border: 'none',
    borderRadius: '50px',
    padding: '18px 40px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#000',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  heroButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 0 50px rgba(0, 255, 255, 0.8)'
  },

  // Main content area
  mainContent: {
    minHeight: '100vh',
    padding: '100px 20px 50px',
    position: 'relative',
    zIndex: 10
  },

  contentGrid: {
    maxWidth: '1600px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '60px',
    alignItems: 'start'
  },

  // Futuristic card design
  card: {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.05) 100%
      )`,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },

  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 128, 0.1))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
  },

  cardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 60px rgba(0, 255, 255, 0.2)',
    border: '1px solid rgba(0, 255, 255, 0.3)'
  },

  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },

  cardIcon: {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #00ffff, #ff0080)',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
  },

  // Advanced form styling
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    marginBottom: '35px'
  },

  inputGroup: {
    position: 'relative'
  },

  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#00ffff',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  input: {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxSizing: 'border-box'
  },

  inputFocus: {
    border: '2px solid #00ffff',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    background: 'rgba(0, 0, 0, 0.7)'
  },

  // Quantum-style button
  quantumButton: {
    width: '100%',
    background: `
      linear-gradient(135deg, 
        transparent 0%,
        rgba(0, 255, 255, 0.1) 25%,
        rgba(255, 0, 128, 0.1) 75%,
        transparent 100%
      )`,
    border: '2px solid',
    borderImage: 'linear-gradient(135deg, #00ffff, #ff0080) 1',
    borderRadius: '15px',
    padding: '20px 30px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },

  quantumButtonHover: {
    background: 'linear-gradient(135deg, #00ffff, #ff0080)',
    color: '#000000',
    boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)'
  },

  // Results panel with holographic effects
  resultsPanel: {
    position: 'sticky',
    top: '100px'
  },

  riskDisplay: {
    textAlign: 'center',
    marginBottom: '40px'
  },

  riskBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 30px',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    border: '2px solid',
    backdropFilter: 'blur(15px)',
    position: 'relative',
    overflow: 'hidden'
  },

  riskHigh: {
    background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(255, 100, 0, 0.2))',
    borderColor: '#ff0040',
    color: '#ffffff',
    boxShadow: '0 0 30px rgba(255, 0, 64, 0.5)'
  },

  riskMedium: {
    background: 'linear-gradient(135deg, rgba(255, 200, 0, 0.2), rgba(255, 150, 0, 0.2))',
    borderColor: '#ffaa00',
    color: '#ffffff',
    boxShadow: '0 0 30px rgba(255, 170, 0, 0.5)'
  },

  riskLow: {
    background: 'linear-gradient(135deg, rgba(0, 255, 100, 0.2), rgba(0, 200, 150, 0.2))',
    borderColor: '#00ff80',
    color: '#ffffff',
    boxShadow: '0 0 30px rgba(0, 255, 128, 0.5)'
  },

  // Holographic progress circle
  progressSection: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '40px',
    textAlign: 'center',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    position: 'relative'
  },

  progressTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#00ffff',
    marginBottom: '25px',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },

  progressContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
    margin: '0 auto'
  },

  progressValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#ffffff',
    textShadow: '0 0 20px #00ffff'
  },

  // AI recommendations panel
  recommendationsPanel: {
    background: `
      linear-gradient(135deg, 
        rgba(0, 0, 0, 0.4) 0%, 
        rgba(0, 100, 200, 0.1) 100%
      )`,
    borderRadius: '20px',
    padding: '35px',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    position: 'relative'
  },

  recommendationsTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  recommendationItem: {
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '18px 20px',
    borderRadius: '12px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    color: '#ffffff'
  },

  recommendationIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #00ffff, #ff0080)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0
  },

  // Empty state with animation
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    color: 'rgba(255, 255, 255, 0.7)'
  },

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    display: 'block',
    filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))',
    animation: 'float 3s ease-in-out infinite'
  },

  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#ffffff'
  }
};

// Advanced CSS animations
const globalStyles = `
  @keyframes holographicShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes logoGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
    50% { box-shadow: 0 0 40px rgba(255, 0, 128, 0.7); }
  }
  
  @keyframes particleFloat {
    0% { background-position: 0px 0px, 0px 0px, 0px 0px, 0px 0px; }
    100% { background-position: 200px 100px, 180px 120px, 220px 90px, 160px 110px; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
  ::-webkit-scrollbar-thumb { 
    background: linear-gradient(135deg, #00ffff, #ff0080); 
    border-radius: 4px; 
  }
  
  /* Selection */
  ::selection {
    background: rgba(0, 255, 255, 0.3);
    color: #ffffff;
  }

  /* Smooth scrolling */
  html { scroll-behavior: smooth; }
  
  /* Input placeholder styles */
  input::placeholder, select option {
    color: rgba(255, 255, 255, 0.5);
  }
`;

function App() {
  const [customerData, setCustomerData] = useState({
    gender: 'Male',
    age: 35,
    tenure: 12,
    monthly_charges: 65.0,
    total_charges: 1500.0,
    internet_service: 'Fiber optic',
    contract: 'Month-to-month',
    payment_method: 'Electronic check',
    paperless_billing: 'Yes',
    tech_support: 'No',
    online_backup: 'No'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'tenure' ? parseInt(value) || 0 : 
             name === 'monthly_charges' || name === 'total_charges' ? parseFloat(value) || 0 : value
    }));
  };

  const predictChurn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/predict`, customerData);
      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('⚠️ Connection Error: Ensure API is running on port 8000');
    }
    setLoading(false);
  };

  const getRiskStyle = (riskLevel) => {
    switch(riskLevel) {
      case 'HIGH': return { ...styles.riskBadge, ...styles.riskHigh };
      case 'MEDIUM': return { ...styles.riskBadge, ...styles.riskMedium };
      case 'LOW': return { ...styles.riskBadge, ...styles.riskLow };
      default: return { ...styles.riskBadge, ...styles.riskLow };
    }
  };

  const HolographicProgress = ({ percentage }) => {
    const circumference = 2 * Math.PI * 80;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div style={styles.progressContainer}>
        <svg width="200" height="200" style={{transform: 'rotate(-90deg)'}}>
          <defs>
            <linearGradient id="holographicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#ff0080" />
              <stop offset="100%" stopColor="#00ff80" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="100" cy="100" r="80"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4" fill="transparent"
          />
          <circle
            cx="100" cy="100" r="80"
            stroke="url(#holographicGrad)"
            strokeWidth="4" fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{transition: 'stroke-dasharray 2s ease-in-out'}}
          />
        </svg>
        <div style={styles.progressValue}>{percentage.toFixed(1)}%</div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.particleLayer}></div>
      
      {/* Futuristic Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🧠</div>
          <span>NEXUS AI</span>
        </div>
        <div style={styles.navStatus}>
          <div style={styles.statusDot}></div>
          <span>SYSTEM ONLINE</span>
        </div>
      </nav>

      {/* Hero Section */}
      {!showMainContent && (
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            NEURAL
            <br />
            CHURN
            <br />
            INTELLIGENCE
          </h1>
          <p style={styles.heroSubtitle}>
            Next-Generation Predictive Analytics
          </p>
          <p style={styles.heroDescription}>
            Harness the power of quantum-inspired machine learning algorithms 
            to predict customer behavior with unprecedented precision and speed.
          </p>
          <button 
            style={styles.heroButton}
            onClick={() => setShowMainContent(true)}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.heroButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.heroButton)}
          >
            ▶ INITIATE ANALYSIS
          </button>
        </section>
      )}

      {/* Main Content */}
      {showMainContent && (
        <div style={styles.mainContent}>
          <div style={styles.contentGrid}>
            
            {/* Input Panel */}
            <div 
              style={styles.card}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.cardHover);
                e.currentTarget.querySelector('.card-glow').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.card);
                e.currentTarget.querySelector('.card-glow').style.opacity = '0';
              }}
            >
              <div className="card-glow" style={styles.cardGlow}></div>
              <h2 style={styles.cardTitle}>
                <div style={styles.cardIcon}>⚡</div>
                NEURAL INPUT MATRIX
              </h2>
              
              <div style={styles.formGrid}>
                {[
                  { name: 'gender', label: 'GENDER', type: 'select', options: [
                    {value: 'Male', label: '👨 MALE'},
                    {value: 'Female', label: '👩 FEMALE'}
                  ]},
                  { name: 'age', label: 'AGE', type: 'number', min: 18, max: 100 },
                  { name: 'tenure', label: 'TENURE', type: 'number', min: 0, max: 72 },
                  { name: 'monthly_charges', label: 'CHARGES/MONTH', type: 'number', min: 20, max: 120, step: 0.01 },
                  { name: 'internet_service', label: 'INTERNET', type: 'select', options: [
                    {value: 'DSL', label: '🌐 DSL'},
                    {value: 'Fiber optic', label: '⚡ FIBER'},
                    {value: 'No', label: '❌ NONE'}
                  ]},
                  { name: 'contract', label: 'CONTRACT', type: 'select', options: [
                    {value: 'Month-to-month', label: '📅 MONTHLY'},
                    {value: 'One year', label: '📋 ANNUAL'},
                    {value: 'Two year', label: '📜 BIENNIAL'}
                  ]}
                ].map((field, index) => (
                  <div key={field.name} style={styles.inputGroup}>
                    <label style={styles.label}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={customerData[field.name]}
                        onChange={handleInputChange}
                        style={styles.input}
                      >
                        {field.options.map(option => (
                          <option key={option.value} value={option.value} style={{background: '#1a1a2e', color: '#fff'}}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={customerData[field.name]}
                        onChange={handleInputChange}
                        style={styles.input}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, styles.input)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                style={styles.quantumButton}
                onClick={predictChurn}
                disabled={loading}
                onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.quantumButtonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.quantumButton)}
              >
                {loading ? '🔄 PROCESSING...' : '🚀 EXECUTE PREDICTION'}
              </button>
            </div>

            {/* Results Panel */}
            <div style={{...styles.card, ...styles.resultsPanel}}>
              <div className="card-glow" style={styles.cardGlow}></div>
              <h2 style={styles.cardTitle}>
                <div style={styles.cardIcon}>🧠</div>
                AI INTELLIGENCE CORE
              </h2>

              {prediction ? (
                <>
                  <div style={styles.riskDisplay}>
                    <div style={getRiskStyle(prediction.risk_level)}>
                      <span style={{fontSize: '1.5rem'}}>
                        {prediction.risk_level === 'HIGH' ? '🔴' : 
                         prediction.risk_level === 'MEDIUM' ? '🟡' : '🟢'}
                      </span>
                      {prediction.risk_level} THREAT LEVEL
                    </div>
                  </div>

                  <div style={styles.progressSection}>
                    <div style={styles.progressTitle}>CHURN PROBABILITY MATRIX</div>
                    <HolographicProgress percentage={prediction.churn_probability * 100} />
                  </div>

                  <div style={styles.recommendationsPanel}>
                    <h3 style={styles.recommendationsTitle}>
                      <span>💡</span>
                      TACTICAL DIRECTIVES
                    </h3>
                    {prediction.recommendations.map((rec, index) => (
                      <div key={index} style={styles.recommendationItem}>
                        <div style={styles.recommendationIcon}>
                          {['🎯', '💰', '📞', '🚀'][index] || '⚡'}
                        </div>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.emptyState}>
                  <span style={styles.emptyIcon}>🤖</span>
                  <h3 style={styles.emptyTitle}>AWAITING INPUT</h3>
                  <p>Initialize customer data matrix to commence neural analysis protocol.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
