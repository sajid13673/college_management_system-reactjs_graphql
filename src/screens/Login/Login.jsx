import React, { useEffect } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useFormik } from "formik";
import { LOGIN_MUTATION } from "../../Graphql/Mutations"; 
import { useMutation } from "@apollo/client";
import { useAuth } from "../../utils/authProvider"; 
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  styled,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Login(props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { setToken, token } = useAuth();
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const validate = (values) => {
    let errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (props.validateEmail(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validate,
    onSubmit: (values) => {
      console.log(values);
      login({
        variables: values,
      });
    },
  });
  useEffect(() => {
    if (data) {
      console.log(data.login);
      setToken(data.login);
    }
    error && console.log(error.message);
  }, [data, error]);
  useEffect(() => {
    token && navigate("/");
  }, [token]);
  const ErrorMessage = styled(Typography)({
    color: "red",
    fontSize: "small",
    fontStyle: "italic",
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          alignItems: "center",
        }}
      >
        <Card
          variant="outlined"
          style={{
            padding: "20px",
            height: "50vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              p: 2,
            }}
          >
            <Avatar
              sx={{ mx: "auto", width: 60, height: 60, bgcolor: "#3f51b5" }}
            >
              <AccountCircleIcon style={{ width: 60, height: 60 }} />
            </Avatar>
            <FormControl>
              <InputLabel htmlFor="my-input">Email address</InputLabel>
              <Input
                error={formik.errors.email}
                className="email-input"
                aria-describedby="my-helper-text"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
              />
              {formik.errors.email ? (
                <ErrorMessage>{formik.errors.email}</ErrorMessage>
              ) : null}
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                error={formik.errors.password}
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.errors.password ? (
                <ErrorMessage> {formik.errors.password}</ErrorMessage>
              ) : null}
            </FormControl>
            <Alert
              sx={{ display: !error && "none", p: 0.4 }}
              variant="filled"
              severity="error"
            >
              <Typography sx={{ fontSize: "x-small" }}>
                {error && error.message}
              </Typography>
            </Alert>
          </CardContent>
          <CardActions sx={{ mt: "auto" }}>
            {!loading ? (
              <Button
                disabled={loading}
                style={{ width: "100%" }}
                variant="contained"
                color="primary"
                type="submit"
              >
                Login
              </Button>
            ) : (
              <CircularProgress sx={{ mx: "auto" }} />
            )}
          </CardActions>
        </Card>
      </Box>
    </form>
  );
}

export default Login;
