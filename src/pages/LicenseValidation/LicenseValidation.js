import React, { useEffect, useState } from "react";
import ldrs from 'ldrs';
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap"; // Used for UI Components
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

// redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import {
  licenseUser,
  licensesocialLogin,
  resetLicenseFlag,
} from "../../slices/thunks"; // Used for API Logics

// type it
import TypeIt from "typeit";

import infinity2 from "../../assets/infinity2.png";
import { createSelector } from "reselect";
import { infinity } from 'ldrs';

infinity.register();
// import images

const LicenseValidation = (props) => {
  const dispatch = useDispatch(); // Used for API connection
  const selectLayoutState = (state) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.Account.user,
    error: state.Login.error,
    loading: state.Login.loading,
    errorMsg: state.Login.errorMsg,
  }));
  // Inside your component
  const { user, error, errorMsg } = useSelector(loginpageData);
  const [userLogin, setUserLogin] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); // Local loading state
  const [loading, setLoading] = useState(true); // Initial loading state set to true

  useEffect(() => {
    if (user && user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user.multiFactor.user.email
          : user.user.email;
      const updatedUserPassword =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? ""
          : user.user.confirm_password;
      setUserLogin({
        email: updatedUserData,
        password: updatedUserPassword,
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "developers@codeplayers.in" || "",
      password: userLogin.password || "Dev123" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      setLocalLoading(true); // Start local loading
      dispatch(licenseUser(values, props.router.navigate)).finally(() => {
        setLocalLoading(false); // End local loading after dispatch
      });
    },
  });

  const signIn = (type) => {
    dispatch(licensesocialLogin(type, props.router.navigate));
  };

  // TYPE_IT
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const typeItInstance = new TypeIt(".text-description", {
        strings: ["ERP on your Fingertips."],
        speed: 50,
        waitUntilVisible: true,
      }).go();

      return () => {
        typeItInstance.destroy();
      };
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLicenseFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  document.title = "Infinity-X | CODEPLAYERS Business System Private Limited";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          {(loading || localLoading) && (
            <div className="loader-overlay">
              <l-infinity
                size="55"
                stroke="4"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="1.3"
                color="white"
              ></l-infinity>
            </div>
          )}
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <img src={infinity2} alt="infinityLogo" height="60" width="212" />
                  </div>
                  <p className="text-description mt-3 fs-15 fw-medium"></p>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome</h5>
                      <p className="text-muted">
                        Login to continue to Infinity-x
                      </p>
                    </div>
                    {error && error ? (
                      <Alert color="danger"> {error} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Username
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={showPassword ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                              onClick={() => setShowPassword(!showPassword)}
                              type="button"
                              id="password-addon"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>
                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Remember me
                          </Label>
                        </div>
                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={error ? null : localLoading ? true : false}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {localLoading ? (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            ) : null}
                            Login
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          <style jsx>{`
            .loader-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #092537;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
            }
          `}</style>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(LicenseValidation);
