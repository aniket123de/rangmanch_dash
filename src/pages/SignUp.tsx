import React, { useContext, useState, FormEvent } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useHistory } from 'react-router-dom';
import { createOrUpdateCreatorProfile } from '../firebase/firestore';
import { signUp } from '../firebase/auth';

interface StyledWrapperProps {
  $isDark: boolean;
}

const SignUp: React.FC = () => {
  const { isDark } = useContext(ThemeContext)!;
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setErrorMessage('Please agree to the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isSigningUp && formData.email && formData.password && formData.username) {
      try {
        setIsSigningUp(true);
        setErrorMessage('');
        
        // Register user with Firebase Auth (role: 'creator')
        const { user } = await signUp(formData.email, formData.password, 'creator', formData.username);
        
        // Save creator profile to Firestore
        await createOrUpdateCreatorProfile(user.uid, {
          name: formData.username,
          email: formData.email,
          avatarUrl: user.photoURL || '',
        });

        // Navigate to dashboard or login page
        history.push('/signin');
      } catch (error: any) {
        setErrorMessage(error.message || 'An error occurred during sign up');
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <StyledWrapper $isDark={isDark}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black transition-colors duration-300">
        <div id="form-ui">
          <form onSubmit={onSubmit} id="form">
            <div id="form-body">
              <div id="welcome-lines">
                <div id="welcome-line-1">Rangmanch</div>
                <div id="welcome-line-2">Create Your Account</div>
              </div>
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              <div id="input-area">
                <div className="form-inp">
                  <input
                    placeholder="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-inp">
                  <input
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-inp">
                  <input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-inp">
                  <input
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div id="checkbox-area">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  I have read and agree to the <Link to="/terms">terms and conditions</Link>
                </label>
              </div>
              <div id="submit-button-cvr">
                <button 
                  id="submit-button" 
                  type="submit"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
              <div id="sign-in-link">
                <Link to="/signin">Already have an account? Sign in</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  
  #form-ui {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    margin-top: 60px;
  }

  #form {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: auto;
    padding: 35px;
    background-color: ${props => props.$isDark ? '#161616' : '#ffffff'};
    box-shadow: 0px 15px 60px ${props => props.$isDark ? '#9d4edd' : '#c77dff'};
    outline: 1px solid ${props => props.$isDark ? '#c77dff' : '#9d4edd'};
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  @media (max-width: 480px) {
    #form-ui {
      padding: 15px;
      margin-top: 40px;
    }
    
    #form {
      padding: 25px;
    }
  }

  #form-body {
    position: relative;
    width: 100%;
    margin-top: 5px;
  }

  #welcome-lines {
    text-align: center;
    line-height: 1.2;
    margin-bottom: 40px;
    padding-top: 5px;
    padding-bottom: 15px;
    overflow: visible;
  }

  #welcome-line-1 {
    background: linear-gradient(45deg, #9d4edd, #c77dff, #ff9e00, #ddff00);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 600;
    font-size: 40px;
    letter-spacing: -1px;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.4;
    padding: 10px 0;
    margin-bottom: 5px;
  }

  #welcome-line-2 {
    color: ${props => props.$isDark ? '#ffffff' : '#161616'};
    font-size: 18px;
    margin-top: 25px;
    transition: color 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  @media (max-width: 480px) {
    #welcome-lines {
      margin-bottom: 30px;
      padding-top: 5px;
    }
    
    #welcome-line-1 {
      font-size: 32px;
      line-height: 1.4;
      padding: 8px 0;
    }
    
    #welcome-line-2 {
      font-size: 16px;
    }
  }

  #input-area {
    margin-top: 40px;
  }

  .form-inp {
    position: relative;
    width: 100%;
    margin-bottom: 15px;
  }

  .form-inp input {
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: 1px solid ${props => props.$isDark ? '#c77dff' : '#9d4edd'};
    border-radius: 8px;
    font-size: 14px;
    color: ${props => props.$isDark ? '#c77dff' : '#9d4edd'};
    font-weight: 400;
    transition: all 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    box-sizing: border-box;
  }

  .form-inp input:focus {
    outline: none;
    border: 1px solid #ff9e00;
    box-shadow: 0 0 10px rgba(255, 158, 0, 0.3);
  }

  .form-inp input::placeholder {
    color: ${props => props.$isDark ? '#666' : '#999'};
    font-size: 14px;
  }

  #checkbox-area {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: ${props => props.$isDark ? '#ffffff' : '#161616'};
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    cursor: pointer;
    line-height: 1.4;
  }

  .checkbox-label input[type="checkbox"] {
    margin-right: 10px;
    width: 16px;
    height: 16px;
    accent-color: #9d4edd;
  }

  .checkbox-label a {
    color: ${props => props.$isDark ? '#c77dff' : '#9d4edd'};
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .checkbox-label a:hover {
    color: #ff9e00;
  }

  @media (max-width: 480px) {
    #input-area {
      margin-top: 30px;
    }
    
    .form-inp input {
      padding: 10px 14px;
      font-size: 13px;
    }

    .checkbox-label {
      font-size: 12px;
    }
  }

  #submit-button-cvr {
    margin-top: 30px;
  }

  #submit-button {
    display: block;
    width: 100%;
    background: linear-gradient(45deg, #9d4edd, #c77dff);
    color: white;
    font-weight: 600;
    font-size: 14px;
    margin: 0;
    padding: 14px 16px;
    border: 0;
    border-radius: 8px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    box-sizing: border-box;
  }

  #submit-button:hover:not(:disabled) {
    background: linear-gradient(45deg, #ff9e00, #ddff00);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(157, 78, 221, 0.3);
  }

  #submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    #submit-button {
      padding: 12px 16px;
      font-size: 13px;
    }
  }

  #sign-in-link {
    text-align: center;
    margin-top: 20px;
    padding-bottom: 10px;
  }

  #sign-in-link a {
    color: ${props => props.$isDark ? '#c77dff' : '#9d4edd'};
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  #sign-in-link a:hover {
    color: #ff9e00;
  }

  .error-message {
    text-align: center;
    color: #ef4444;
    margin: 10px 0;
    padding: 8px;
    border-radius: 8px;
    background-color: ${props => props.$isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
    font-size: 14px;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  @media (max-width: 480px) {
    #sign-in-link a {
      font-size: 13px;
    }
    
    .error-message {
      font-size: 13px;
      padding: 6px;
    }
  }
`;

export default SignUp; 