import React, { useContext, useState, FormEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { doSignInWithGoogle, doSignInWithEmailAndPassword } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';
import { createOrUpdateCreatorProfile } from '../firebase/firestore';

interface StyledWrapperProps {
  $isDark: boolean;
}

const Login: React.FC = () => {
  const { isDark } = useContext(ThemeContext)!;
  const { userLoggedIn, login } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isSigningIn && email && password) {
      try {
        setIsSigningIn(true);
        setErrorMessage('');
        await doSignInWithEmailAndPassword(email, password);
        login(); // Update auth state
        history.push('/'); // Navigate to dashboard
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        setErrorMessage('');
        const user = await doSignInWithGoogle();
        // Update creator profile with avatarUrl only if photoURL exists
        const profileData: any = {
          name: user.displayName,
          email: user.email,
        };
        if (user.photoURL) {
          profileData.avatarUrl = user.photoURL;
        }
        await createOrUpdateCreatorProfile(user.uid, profileData);
        login(); // Update auth state
        history.push('/'); // Navigate to dashboard
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Redirect to="/" />}
      <StyledWrapper $isDark={isDark}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black transition-colors duration-300">
          <div id="form-ui">
            <form onSubmit={onSubmit} id="form">
              <div id="form-body">
                <div id="welcome-lines">
                  <div id="welcome-line-1">Rangmanch</div>
                  <div id="welcome-line-2">Login to Proceed</div>
                </div>
                {errorMessage && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}
                <div id="input-area">
                  <div className="form-inp">
                    <input
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-inp">
                    <input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-inp">
                    <input
                      placeholder="Role"
                      type="hidden"
                      value="creator"
                      disabled
                      style={{ 
                        backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                        cursor: 'not-allowed',
                        opacity: 0.7
                      }}
                    />
                  </div>
                </div>
                <div id="submit-button-cvr">
                  <button 
                    id="submit-button" 
                    type="submit"
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                <div id="separator">
                  <span>OR</span>
                </div>
                <div id="google-button-cvr">
                  <button 
                    id="google-button" 
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={isSigningIn}
                  >
                    <img src="/google-icon.svg" alt="Google" />
                    {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                  </button>
                </div>
                <div id="forgot-pass">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <div id="sign-up-link">
                  <Link to="/signup">Don't have an account? Sign up</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </StyledWrapper>
    </>
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

  .form-inp input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .form-inp input::placeholder {
    color: ${props => props.$isDark ? '#666' : '#999'};
    font-size: 14px;
  }

  @media (max-width: 480px) {
    #input-area {
      margin-top: 30px;
    }
    
    .form-inp input {
      padding: 10px 14px;
      font-size: 13px;
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

  #separator {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
  }

  #separator::before,
  #separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${props => props.$isDark ? '#666' : '#e0e0e0'};
  }

  #separator span {
    padding: 0 10px;
    color: ${props => props.$isDark ? '#666' : '#999'};
    font-size: 12px;
  }

  #google-button-cvr {
    margin-top: 20px;
  }

  #google-button {
    width: 100%;
    padding: 12px 16px;
    background: ${props => props.$isDark ? '#2a2a2a' : 'white'};
    border: 1px solid ${props => props.$isDark ? '#444' : '#ddd'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    color: ${props => props.$isDark ? '#ffffff' : '#333'};
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    box-sizing: border-box;
    font-weight: 500;
  }

  #google-button:hover:not(:disabled) {
    background: ${props => props.$isDark ? '#3a3a3a' : '#f5f5f5'};
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }

  #google-button img {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  #google-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    #google-button {
      padding: 10px 16px;
      font-size: 13px;
    }
    
    #google-button img {
      width: 16px;
      height: 16px;
    }
  }

  #forgot-pass {
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  #forgot-pass a {
    color: ${props => props.$isDark ? '#666' : '#999'};
    font-size: 12px;
    text-decoration: none;
    transition: color 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  #forgot-pass a:hover {
    color: #ff9e00;
  }

  #sign-up-link {
    text-align: center;
    margin-top: 5px;
    padding-bottom: 10px;
  }

  #sign-up-link a {
    color: ${props => props.$isDark ? '#c77dff' : '#9d4edd'};
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  #sign-up-link a:hover {
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
    #forgot-pass a {
      font-size: 11px;
    }
    
    #sign-up-link a {
      font-size: 13px;
    }
    
    .error-message {
      font-size: 13px;
      padding: 6px;
    }
  }

  #bar {
    position: absolute;
    left: 50%;
    bottom: -80px;
    width: 28px;
    height: 8px;
    margin-left: -33px;
    background: linear-gradient(45deg, #9d4edd, #c77dff);
    border-radius: 10px;
  }

  #bar:before,
  #bar:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background: ${props => props.$isDark ? '#ff9e00' : '#ddff00'};
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  #bar:before {
    right: -20px;
  }

  #bar:after {
    right: -38px;
  }

  @media (max-width: 480px) {
    #bar {
      bottom: -60px;
      width: 24px;
      height: 6px;
      margin-left: -29px;
    }
    
    #bar:before,
    #bar:after {
      width: 6px;
      height: 6px;
    }
    
    #bar:before {
      right: -18px;
    }
    
    #bar:after {
      right: -32px;
    }
  }
`;

export default Login;