import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  // If authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 bg-mesh-pattern">
      <div className="relative max-w-md w-full mx-4">
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-8 shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/20 transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent hover:scale-[1.01] transition-transform duration-300">
              Sign in to ShareHub
            </h2>
            <p className="mt-2 text-center text-dark-400">
              Enter your credentials to access your account
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <div className="space-y-5">
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-1 group-hover:text-primary-400 transition-colors">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none block w-full px-4 py-3 border bg-dark-950/50 border-dark-700/50 placeholder-dark-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 hover:border-primary-500/30 group-hover:shadow-lg group-hover:shadow-primary-500/10 sm:text-sm transition-all"
                      placeholder="you@example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.email && errors.email && (
                      <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-1 group-hover:text-primary-400 transition-colors">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none block w-full px-4 py-3 border bg-dark-950/50 border-dark-700/50 placeholder-dark-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 hover:border-primary-500/30 group-hover:shadow-lg group-hover:shadow-primary-500/10 sm:text-sm transition-all"
                      placeholder="••••••••"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.password && errors.password && (
                      <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 disabled:opacity-50 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>

                <div className="text-sm text-center">
                  <Link 
                    to="/register" 
                    className="font-medium text-primary-400 hover:text-primary-300 transition-colors hover:underline decoration-primary-500/30 underline-offset-4"
                  >
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
} 