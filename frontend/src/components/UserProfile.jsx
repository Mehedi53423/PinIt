//import { useDocumentOperation } from "@sanity/react-hooks";
import React, { useEffect, useState } from "react";
import { GoogleLogout } from "react-google-login";
import { AiOutlineEdit, AiOutlineLogout, AiOutlineSave } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import noPin from "../assets/neo-sakura-404-not-found.png";
import { client } from "../client";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-green-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();
  //const { patch } = useDocumentOperation(userId, "user");
  //console.log(user.username);
  //console.log(user.userimage);

  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  //const userIfo =
  //localStorage.getItem("user") !== "undefined"
  //? JSON.parse(localStorage.getItem("user"))
  //: localStorage.clear();

  const [clc, setClc] = useState();
  const [cBio, setCbio] = useState();
  //const doc = {
  //_id: userId,
  //_type: "user",
  //userName: {name},
  //image: {imageUrl},
  //bio: cBio,
  //};

  const changeBio = (userId) => {
    //patch.execute([{ set: { bio: cBio } }]);
    //client.create(doc).then((res) => {
    //window.location.reload();
    //});
    //client
    //.patch("user")
    //.ifRevisionId(userId)
    //.set({ bio: cBio })
    //.commit()
    //.then(() => {
    //window.location.reload();
    //});
    setClc(false);
  };

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="rounded-full w-30 h-30 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>

          <h1 className="font-bold text-3xl text-center mt-3 pb-2">
            {user.userName}
          </h1>

          {userId === User.googleId ? (
            <div className="flex flex-col w-full items-center">
              {clc ? (
                <dive className="flex flex-col w-full items-center">
                  <input
                    className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                    type="text"
                    value={cBio}
                    onChange={(e) => setCbio(e.target.value)}
                    placeholder="Add bio"
                  />

                  <button type="button" onClick={changeBio} className="pt-2">
                    <AiOutlineSave color="green" fontSize={21} />
                  </button>
                </dive>
              ) : (
                <div>
                  <h1 className="font-bold text-xl text-center mt-3">
                    {user.bio}
                  </h1>

                  <button
                    type="button"
                    onClick={() => setClc(true)}
                    className="pt-2"
                  >
                    <AiOutlineEdit color="skyblue" fontSize={21} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <h1 className="font-bold text-xl text-center mt-3">User</h1>
          )}

          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User.googleId && (
              <GoogleLogout
                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                render={(renderProps) => (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
                onLogoutSuccess={logout}
                cookiePolicy="single_host_origin"
              />
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>

        <div className="px-2">
          <MasonryLayout pins={pins} />
        </div>

        {pins?.length === 0 && (
          <div className="flex flex-col w-full items-center">
            <div className="">
              <img src={noPin} className="flex h-60" alt="" />
            </div>
            <div>
              <b>
                <h1 className="flex justify-center items-center w-full mt-2 font-dance text-4xl">
                  No Pins Found...!
                </h1>
              </b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
