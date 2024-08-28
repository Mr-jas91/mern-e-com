import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setIsAuthenticated } = useAuth();
  const history = useHistory();
  const registeruser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        firstName,
        lastName,
        email,
        password,
      });
      const { refreshToken } = response.data;
      localStorage.setItem("refreshToken", refreshToken);
      setIsAuthenticated(true);
      history.push("/");
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.data);
    }
  };

  return (
    <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
      <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
        <div className="flex items-center justify-center w-full ">
          <div className="flex items-center ">
            <form
              onSubmit={registeruser}
              className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
            >
              <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                Sign Up
              </h3>
              <p className="mb-4 text-grey-700">Enter details</p>
              <p className="text-red-800 text-lg">{`${message}`}</p>
              <label
                htmlFor="fName"
                className="mb-2 text-sm text-start text-grey-900"
              >
                First name*
              </label>
              <input
                id="fName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="mail@loopple.com"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
              />
              <label
                htmlFor="lName"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Last name*
              </label>
              <input
                id="lName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="mail@loopple.com"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
              />
              <label
                htmlFor="email"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Email*
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="mail@loopple.com"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
              />
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Password*
              </label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter a password"
                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
              />

              <button
                type="submit"
                className="w-full px-6 py-5 mb-5 text-xl font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-Zinc-900 bg-Zinc-800 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
              >
                Sign Up
              </button>
              <p className="text-sm leading-relaxed text-grey-900">
                Already a account{" "}
                <Link to="/login" className="font-bold text-grey-700">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
