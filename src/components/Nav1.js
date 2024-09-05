import React, { useEffect, useState } from "react";
import '../App.css';
import '../css1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';
import { useUserAuth } from "../store";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./Searchbar";
import { SearchResultsList } from "./SearchResultsList";

function Nav1() {

    const retrieveState = () => {
        const storedState = localStorage.getItem('userAuthState');
        return storedState != null ? JSON.parse(storedState) : {
            id: null,
            username: '',
            email: '',
            password: '',
            registered: '',
            address: '',
            bio: ''};
      }
    // const initialState = useUserAuth.retrieveState();
    useUserAuth.setState(retrieveState);


    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const Logout = async () => {
        localStorage.removeItem('userAuthState');
        window.location.reload();
        // navigate("/");
    }

    var id = useUserAuth.getState().id;

    useEffect(() => {
        id = useUserAuth.getState().id;
    }, [])

    return (
        <div className="">
            {/* <h1 id="mainheader"><a href="/">PH Store</a></h1> */}
            <div className="navbar navbar-expand-md navbar-dark navv fixed-top">
                <div className="container-fluid">
                    <div><Link className="nav-link" to="/"><img src="../gfxphlogo.png" className="logo"></img></Link></div><h1 id="mainheader"><Link className="nav-link navbar-brand" to="/">PH Marketplace</Link></h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/ProductsPage">Products</Link></li>
                            {id != null ? (<li className="nav-item"><Link className="nav-link" to="/FavoritesPage">Favorites</Link></li>) : (<li className="nav-item"><Link className="nav-link" to="/Signup">Favorites</Link></li>)}
                            {id == null && <li className="nav-item"><Link className="nav-link" to="/Register">Login / Register</Link></li>}
                            {id != null && <li className="nav-item"><Link className="nav-link" to="/" onClick={Logout}>Log Out</Link></li>}
                            {id != null && <li className="nav-item"><Link className="nav-link" to="/UserProfileBoots">User Profile</Link></li>}
                            {id != null && <li className="nav-item"><Link className="nav-link" to="/AddProduct">Add a Product</Link></li>}
                            <li className="nav-item mx-2">
                                <SearchBar setResults={setResults} />
                                {results && results.length > 0 && <SearchResultsList results={results} />}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Nav1;