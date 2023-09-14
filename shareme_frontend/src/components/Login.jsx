import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { FcGoogle } from "react-icons/fc";
import jwtDecode from "jwt-decode";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    try {
      console.log(response);
      var decodedHeader = jwtDecode(response.credential);
      console.log(decodedHeader);
      localStorage.setItem("user", JSON.stringify(decodedHeader));
      //destrcure some of the props from that response
      const { name, sub, picture } = decodedHeader;

      const doc = {
        _id: sub,
        _type: "user",
        userName: name,
        image: picture,
      };

      console.log(name);
      console.log(sub);
      console.log(picture);

      client
        .createIfNotExists(doc)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((error) => console.log(error));
    } catch (e) {
      localStorage.clear(); //what you need to do incase the jwt is not valid
      console.log(e); //for your own debugging
    }
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative h-full w-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className=" bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                >
                  <FcGoogle className="mr-4 " />
                  Sign In with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onError={responseGoogle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
