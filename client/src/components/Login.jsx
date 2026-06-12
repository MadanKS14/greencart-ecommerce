import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setIsSeller, setUser, axios, navigate } = useAppContext();

  const [state, setState] = React.useState("login");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // ✅ New role state
  const [role, setRole] = React.useState("user");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let payload;

      if (state === "login") {
        payload = {
          email,
          password,
        };
      } else {
        payload = {
          name,
          email,
          password,
          role,
        };
      }

      const { data } = await axios.post(
        `/api/user/${state}`,
        payload
      );

      if (data.success) {
        setUser(data.user);

        setIsSeller(data.user.role === "seller");

        toast.success(
          state === "login"
            ? "Login Successful"
            : "Registration Successful"
        );

        setShowUserLogin(false);

        if (data.user.role === "seller") {
          navigate("/seller");
        } else {
          navigate("/");
        }
      }
    }
    catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-lg shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl text-center font-bold">
          {state === "login"
            ? "Login"
            : "Create Account"}
        </h2>

        {state === "register" && (
          <>
            <div>
              <p>Name</p>

              <input
                className="border w-full p-2 rounded"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

            {/* Role Selection */}

            <div>
              <p>Register As</p>

              <select
                className="border w-full p-2 rounded"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >
                <option value="user">
                  User
                </option>

                <option value="seller">
                  Seller
                </option>
              </select>
            </div>
          </>
        )}

        <div>
          <p>Email</p>

          <input
            className="border w-full p-2 rounded"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div>
          <p>Password</p>

          <input
            className="border w-full p-2 rounded"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <button
          className="bg-primary text-white py-2 rounded"
        >
          {state === "login"
            ? "Login"
            : "Register"}
        </button>

        {state === "login" ? (
          <p>
            Don't have an account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() =>
                setState("register")
              }
            >
              Register
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() =>
                setState("login")
              }
            >
              Login
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;