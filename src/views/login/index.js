import React, { useState } from 'react';
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  CardGroup,
} from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authActions';
import { splitIntoSegments } from '../../../build/static/media/index.6f296468231c5dacc283.cjs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [isSpin, setIsSpin] = useState(false);
  const dispath = useDispatch();

  const handleLogin = async () => {
    setIsSpin(true)
    if (!email) {
      setIsEmailError(true);
    }
    if (!password) {
      setIsPasswordError(true);
    }

    if (isEmailError || isPasswordError) {
      return
    }
    try {
      console.log("Email", email);
      const auth = await dispath(login(email, password));
      if (auth.success) {
        //return navigate("/admin/dashboard"); // Navega a /home
        return window.location.href = '/admin/dashboard';
      }
      setErrorLogin(true);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsSpin(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <CardGroup>
              <Card className="p-4">
                <div className="card-body">
                  <Form>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <div className="col-auto">
                      <label style={{ fontSize: 16, fontWeight: 'bold' }}>Email:</label>
                      <div className="mb-2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <div className="input-group-text" style={{ height: 40 }}>
                              <i class="fa-solid fa-envelope"></i>
                            </div>
                          </div>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setIsEmailError(false);
                              setErrorLogin(false);
                            }}
                          ></input>
                        </div>
                        <small style={{ color: 'red', fontSize: 11 }}>{isEmailError && 'Este campo es requerido'}</small>
                      </div>
                    </div>

                    <div className="col-auto">
                      <label style={{ fontSize: 16, fontWeight: 'bold' }}>Clave:</label>
                      <div className="mb-2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <div className="input-group-text" style={{ height: 40 }}>
                              <i class="fa-solid fa-key"></i>
                            </div>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Clave"
                            onChange={(e) => {
                              setErrorLogin(false);
                              setPassword(e.target.value);
                            }}
                          ></input>
                        </div>
                        <small style={{ color: 'red', fontSize: 11 }}>{isPasswordError && 'Este campo es requerido'}</small>
                      </div>
                    </div>

                    {errorLogin && <small style={{ color: 'red' }}>Credenciales inválidas</small>}
                    {
                      isSpin &&
                      <i class="fa-solid fa-circle-notch fa-spin"></i>
                    }
                    <Row>
                      <Col xs={6}>
                        <Button className="btn btn-primary btn-fill" onClick={handleLogin} disabled={isSpin}>
                          <i class="fa-solid fa-lock-open"></i>&nbsp;
                          Login
                        </Button>
                      </Col>
                      <Col xs={6} className="text-right">
                        <Button color="link" className="px-2">
                          Forgot password?
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
                {/*<CardBody>
                  <Form>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <FormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <small className="error" style={{ color: 'red', fontSize: 11 }}>{isEmailError && 'Este campo es requerido'}</small>
                    <CInputGroup className="mt-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <FormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <small className="error" style={{ color: 'red', fontSize: 11 }}>{isPasswordError && 'Este campo es requerido'}</small>
                    {error && <small style={{ color: 'red' }}>Credenciales inválidas</small>}
                    <Row className='mt-4'>
                      <Col xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </Col>
                      <Col xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>*/}
              </Card>
              <Card className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <div className='card-body'>
                  <div className="col-auto col">
                    <img src={require('assets/img/icons.png')} width={100}></img>
                  </div>
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <a to="/register">
                      <Button className="mt-3 btn btn-primary btn-fill" active tabIndex={-1}>
                        Register Now!
                      </Button>
                    </a>
                  </div>
                </div>
                {/*<CardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CardBody>*/}
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container >
    </div >

  )
}

export default Login