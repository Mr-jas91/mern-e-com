import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { signIn } from "../../services/authServices";
function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { message, setIsAuthenticated, setMessage, setLoading } = useAuth();
  const history = useHistory();
  const validUser = async (e) => {
    e.preventDefault();
    const auth = await signIn(
      { email, password },
      setIsAuthenticated,
      setMessage,
      history
    );
  };

  return (
    <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
      <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
        <div className="flex items-center justify-center w-full ">
          <div className="flex items-center ">
            <form
              onSubmit={validUser}
              className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
            >
              <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                Sign In
              </h3>
              <p className="mb-4 text-grey-700">
                Enter your email and password
              </p>

              <label
                htmlFor="email"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Email*
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="mail@loopple.com"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
              />
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Password*
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter a password"
                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
              />
              <div className=" mb-8">
                <Link
                  to="/"
                  className="mr-4 text-lg font-medium text-purple-blue-500"
                >
                  Forget password?
                </Link>
              </div>
              <p className="text-red-800 text-lg">{message}</p>
              <button
                type="submit"
                className="w-full px-6 py-5 mb-5 text-xl font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-Zinc-900 bg-Zinc-800 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
              >
                Sign In
              </button>
              <p className="text-sm leading-relaxed text-grey-900">
                Not registered yet?{" "}
                <Link to="/signup" className="font-bold text-grey-700">
                  Create an Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
