import React, { useState, useEffect } from "react";
import { Input, Button, List, ListItem, Image, Divider, Text, ThemeIcon } from '@mantine/core';
import location_pin from '../../../assets/location-pin.png'
import { useDebounce } from "@uidotdev/usehooks";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};


const SearchBox = (props) =>{
  const { selectPosition, setSelectPosition } = props;
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 300);

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setSearchText(formData.get("search"));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchText) {
        setIsSearching(true);
        const queryParams = {
          q: debouncedSearchText,
          format: "json",
          addressdetails: 1,
          polygon_geojson: 0,
        };
        const queryString = new URLSearchParams(queryParams).toString();
        try {
          const response = await fetch(`${NOMINATIM_BASE_URL}${queryString}`);
          const data = await response.json();
          setListPlace(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setIsSearching(false);
      } else {
        setListPlace([]);
      }
    };

    fetchData();
  }, [debouncedSearchText]);
  return (
    <div style={{ display: "flex", flexDirection: "column", paddingBlockStart: "10px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSubmit}>
            <Input
              style={{ width: "100%" , flex: 1, marginRight: "10px" }}
              name="search"
              value={searchText}
              onChange={handleChange}
            />
            <Button
              type="submit"
              disabled={isSearching}
              style={{ marginTop: "10px", border: "10px", textAlign: "center"}}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>
      </div>
      <div>
        <List component="nav" aria-label="main mailbox folders">
          {listPlace.map((item) => (
            <div key={item?.place_id} style={{ paddingBlockStart: "10px" }}>
              <Button
                onClick={() => {
                  setSelectPosition(item);
                  setSearchText('');
                }}
                style={{ marginTop: "10px", border: "10px" }}
              >
                <Image height={30} width={30} src={location_pin} style={{ marginRight: "10px" }} />
                <Text>{item?.display_name}</Text> 
              </Button>
              <Divider/>
            </div>
          ))}
        </List>
      </div>
    </div>
  );
}

export default SearchBox