// screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormContainer from './Shared/FormContainer';
import Input from './Shared/Input';
import GoogleLogin from './Shared/GoogleLogin';
import FacebookLogin from './Shared/FacebookLogin'; // Import the new component
import { AuthContext } from '../Context/Store/AuthGlobal';
import { loginUser } from '../Context/Actions/Auth.actions';

const LoginScreen = ({ navigation }) => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      setError("Please fill in your credentials");
      return;
    }
    
    // Remove the error message if previously shown
    setError("");
    setIsLoading(true);
    
    const user = {
      email,
      password,
    };
    
    try {
      // loginUser now returns a boolean success value
      const success = await loginUser(user, dispatch);
      
      if (!success) {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    dispatch({
      type: 'SET_CURRENT_USER',
      payload: {
        isAuthenticated: true,
        user: userData
      }
    });
    
    // Wait a moment before navigating
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.subtitle}>Glow with Confidence, Bliss in Every Touch!</Text>
      </View>
      <FormContainer>
        <Input
          placeholder="Email"
          name="email"
          id="email"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder="Password"
          name="password"
          id="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <View style={styles.buttonGroup}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#e89dae" />
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleSubmit}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>Sign in with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => GoogleLogin.signIn(handleLoginSuccess)}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, styles.facebookButton]}
              onPress={() => FacebookLogin.signIn(handleLoginSuccess)}
            >
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.registerContainer}>
          <Text style={styles.middleText}>Don't have an account yet? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </FormContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5ec',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 10,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e89dae',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  middleText: {
    color: '#666',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialLoginContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  socialLoginText: {
    color: '#666',
    marginBottom: 10,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4267B2',
  },
  loginButton: {
    backgroundColor: '#e89dae',
    width: '60%',
    padding: 10,
    borderRadius: 20,
    marginTop: -10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    color: '#e89dae',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;