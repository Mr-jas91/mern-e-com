import React, { useEffect, useState, useRef } from "react";

function user() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mail, setMail] = useState("");
  const [num, setNum] = useState("");
  const [gender, setGender] = useState("Male");
  const [isEdit, setIsEdit] = useState(false);
  const [isEditNum, setIsEditNum] = useState(false);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const firstNameRef = useRef(null);
  const mailRef = useRef(null);
  const numRef = useRef(null);

  // ref for info
  useEffect(() => {
    if (isEdit && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [isEdit]);

  //ref for email
  useEffect(() => {
    if (isEditEmail && mailRef.current) {
      mailRef.current.focus();
    }
  }, [isEditEmail]);

  //ref for mobile number
  useEffect(() => {
    if (isEditNum && numRef.current) {
      numRef.current.focus();
    }
  }, [isEditNum]);
  return (
    <div className="w-full">
      <div className="flex flex-row gap-2 justify-center items-center">
        <p className="text-3xl text-black">Personal info</p>
        <button onClick={() => setIsEdit(!isEdit)} className="text-blue-600">
          {isEdit ? "Cancel" : "Edit"}
        </button>
      </div>
      <form className="flex justify-center">
        <div>
          <div>
            <p className="text-xl font-bold flex justify-start">Name</p>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <input
                type="text"
                className={`rounded-md w-48  p-2 ${
                  isEdit ? "cursor-text" : "cursor-not-allowed"
                }`}
                ref={firstNameRef}
                placeholder="Enter first name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
                readOnly={!isEdit}
              />
              <input
                type="text"
                className={`rounded-md w-48  p-2 ${
                  isEdit ? "cursor-text" : "cursor-not-allowed"
                }`}
                placeholder="Enter last name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
                readOnly={!isEdit}
              />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold flex justify-start py-4">Gender</p>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  disabled={!isEdit}
                  className={`${
                    isEdit ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  disabled={!isEdit}
                  className={`${
                    isEdit ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="flex flex-row gap-2 justify-center items-center pt-10">
        <p className="text-3xl text-black">Email address</p>
        <button
          onClick={() => setIsEditEmail(!isEditEmail)}
          className="text-blue-600"
        >
          {isEditEmail ? "Cancel" : "Edit"}
        </button>
      </div>
      <form className="flex justify-center pt-4">
        <input
          type="email"
          className={`rounded-md w-48  p-2 ${
            isEditEmail ? "cursor-text" : "cursor-not-allowed"
          }`}
          ref={mailRef}
          placeholder="Enter Email address"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
          readOnly={!isEditEmail}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md ml-4"
        >
          Change
        </button>
      </form>
      <div className="flex flex-row gap-2 justify-center items-center pt-10">
        <p className="text-3xl text-black">Mobile number</p>
        <button
          onClick={() => setIsEditNum(!isEditNum)}
          className="text-blue-600"
        >
          {isEditNum ? "Cancel" : "Edit"}
        </button>
      </div>
      <form className="flex justify-center pt-4">
        <input
          type="tel"
          className={`rounded-md w-48  p-2 ${
            isEdit ? "cursor-text" : "cursor-not-allowed"
          }`}
          ref={numRef}
          placeholder="Enter Mobile number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          required
          readOnly={!isEditNum}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md ml-4"
        >
          Change
        </button>
      </form>
    </div>
  );
}

export default user;
