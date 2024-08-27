import { useState } from "react";
import axios from "axios";
import "../css1.css"


export const SearchBar = ({ setResults }) => {

    const ax1 = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
    });

    const [input, setInput] = useState("");

    const fetchData = async (value) => {
        try {
            const response = await ax1.post("/api/getUsers", {
                value: value
            });
            console.log(response.data);
            setResults(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (value) => {
        setInput(value);
        if (value != '')
            fetchData(value);
        else setResults([]);
    };

    return (
        <div className="input-wrapper">
            <input
                placeholder="Search user..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};