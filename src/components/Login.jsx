import React, { useEffect } from "react";
import {
  Button,
  Card,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useFormik } from "formik";
import { LOGIN_MUTATION } from "../Graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useAuth } from "../utils/authProvider";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  CardActions,
  CardContent,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { setToken, token } = useAuth();
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
      login({
        variables: values,
      });
      if (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    if (data) {
      console.log(data.login);
      setToken(data.login);
    }
  }, [data]);
  useEffect(() => {
    token && navigate("/");
  }, [token]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* <Grid  sx={{ background: 'red', height: '100vh' }}> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          alignItems: "center",
        }}
      >
        <Card
          variant="contained"
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
              <AccountCircleIcon sx={{ width: 60, height: 60 }} />
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
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
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
                <div className="error">{formik.errors.password}</div>
              ) : null}
            </FormControl>
          </CardContent>
          <CardActions sx={{ mt: "auto" }}>
            <Button
              style={{ width: "100%" }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </CardActions>
        </Card>
      </Box>
    </form>
  );
}

export default Login;
