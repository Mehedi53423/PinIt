import React, { useEffect, useState } from "react";
import search from "../assets/neo-sakura-searching.png";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== "") {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Searching pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="flex flex-col w-full items-center">
          <div className="">
            <img src={search} className="flex h-60" alt="" />
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
  );
};

export default Search;
