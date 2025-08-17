import React, { useEffect, useRef, useState } from "react";
import Pill from "./Pill";

export default function SearchBar(){
    
    const[searchParam, setSearchParam] = useState("");
    const[searchParamDebounced, setSearchParamDebounced] = useState("");
    const[searchResults, setSearchResults] = useState([]);
    const[selectedResults, setSelectedResults] = useState(new Set());
    const inputRef = useRef();

    /* debounce the searches */
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParamDebounced(searchParam)
        }, 2000)
        return () => {clearTimeout(timer)}
    }, [searchParam])

    /* use the debounce search param to hit API */
    useEffect(() => {
          async function fetchResults() {
            if (!searchParamDebounced) {
                setSearchResults([])
                return;
            }
            const results = await getResults();   
            setSearchResults(results);          
        }
        fetchResults();
    },[searchParamDebounced])

    useEffect(() => {
        inputRef.current.focus();
    },[])

    async function getResults(){
        const results = await fetch(`https://dummyjson.com/users/search?q=${searchParam}`);
        return await results.json();
    }

    function handleOnChange(e){
        setSearchParam(e.target.value);
    }

    function handleSearchClick(selectedSearch){
        setSelectedResults(prev => new Set(prev).add(selectedSearch))
        setSearchResults(prev => ({
            ...prev,
            users: prev.users.filter(user => user.email !== selectedSearch.email)
        }));
        inputRef.current.focus();
    }

    function onSelectionCancel(user) {

        setSelectedResults(prev => {
            const updated = new Set(prev);
            updated.delete(user);
            return updated;
        });

        setSearchResults(prev => ({
            ...prev,
            users: [...prev?.users, user] 
        }));
    }

    return(
        <>
        <div className="search-bar">
            {[...selectedResults].map((user, idx) => (
                <Pill user={user} onSelectionCancel={() => onSelectionCancel(user)}/>
            ))}
            {/* search input box */}
            <input 
                ref={inputRef}
                className="search-input"
                value={searchParam}    
                placeholder="Search here..."
                onChange={handleOnChange}
            />
        </div>
            {/* suggestion list */}
            <div className={`suggestion-list`} style={{ height: `${(Math.min((searchResults?.users?.length || 0) * 10, 30))}rem` }}>
                {searchParam.length > 0 && searchResults?.users && searchResults.users.map((user, idx) => (
                    <li onClick={()=>handleSearchClick(user)}>
                        <img src = {user.image}></img>
                        <span>{user.firstName} {user.lastName}</span>
                    </li>
                ))}
            </div>
        </>
    );
}