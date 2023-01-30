import React, { useState } from "react";
import registerImage from "../../assets/images/register.svg";
import { Link } from "react-router-dom";

import { register } from "../../store/actions/auth";
import { useDispatch } from "react-redux";

import "./Auth.scss";

const Register = ({ history }) => {
  const dispatch = useDispatch();
  const [firstName, setFirsName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [password, setPassword] = useState("");

  const submitForm = (e) => {
    e.preventDefault();

    dispatch(
      register({ firstName, lastName, email, gender, password }, history)
    );
  };

  return (
    <div id="auth-container">
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={registerImage} alt="Login" />
          </div>

          <div id="form-section">
            <h2>Create an account</h2>

            <form onSubmit={submitForm}>
              <div className="input-field mb-1">
                <input
                  onChange={(e) => setFirsName(e.target.value)}
                  value={firstName}
                  required="required"
                  type="text"
                  placeholder="First Name"
                />
              </div>

              <div className="input-field mb-1">
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required="required"
                  type="text"
                  placeholder="Last Name"
                />
              </div>

              <div className="input-field mb-1">
                <select onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="input-field mb-1">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required="required"
                  type="text"
                  placeholder="Email"
                />
              </div>

              <div className="input-field mb-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required="required"
                  type="password"
                  placeholder="Password"
                />
              </div>

              <button>REGISTER</button>
            </form>

            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
