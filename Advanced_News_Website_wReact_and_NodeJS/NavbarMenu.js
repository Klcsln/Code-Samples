import React, {useState} from 'react'
import './NavBarMenu.css'
import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NavbarSwitch from '../NavbarSwitch/NavbarSwitch';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { Link, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import AsyncSelect from 'react-select/async'
import { IconContext } from "react-icons";

const SearchWrapper = styled.div`
        width: 15%;
        @media (max-width: 768px) {
            width: 80%;
        }
        `;
        
function NavbarMenu () {

    const [options, setOptions] = useState([])
    const [input, setInput] = useState('')

    let location = useLocation();
    let history = useHistory();

    const fetchData = async (inputValue) => {
        const url = `https://furkan.cognitiveservices.azure.com/bing/v7.0/suggestions?q=${inputValue}`;
        return fetch(url,{
            headers:{
                'Ocp-Apim-Subscription-Key': '99fd889c5c344afe8bd1238ebb6a1805'
            }
        })
        .then(response => response.json())
        .then(data => {
            let suggestions = []
            if(data === undefined) {setOptions(suggestions) }
            else{
                data.suggestionGroups['0'].searchSuggestions.map(item => {
                    suggestions.push({label:item.query, value:item.query})
                })
                setOptions(suggestions)
            }
        })
        .catch(err => {
        console.log(err);
        });
    }
    const loadOptions = async () => {
        return options        
    };

    const handleInputChange = (newValue) => {
    let inputValue = newValue.replace(/\W/g, '');
    fetchData(inputValue)
    setInput(inputValue);
    };

    const handleOnChange = (item) => {
        setInput(item.value)
        history.push(`search/${item.value}`)
    }
    return(
        <Navbar bg="custom" expand="lg" >
        <SearchWrapper>
        <form>
        <AsyncSelect
            value={input}
            placeholder="Enter keyword .. "
            isClearable={true}
            loadOptions={loadOptions}
            onInputChange={(e) => {handleInputChange(e)}}
            onChange={(item) => {handleOnChange(item)}}
            />
        </form>
            
        </SearchWrapper>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-custom" >
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/" className="text-white-50 ">Home</Nav.Link>
                <Nav.Link as={Link} to="/world" className="text-white-50">World</Nav.Link>
                <Nav.Link as={Link} to="/politics" className="text-white-50">Politics</Nav.Link>
                <Nav.Link as={Link} to="/business" className="text-white-50">Business</Nav.Link>
                <Nav.Link as={Link} to="/technology" className="text-white-50">Technology</Nav.Link>
                <Nav.Link as={Link} to="/sport" className="text-white-50">Sports</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
                <Navbar.Brand className="text-white">
                <IconContext.Provider value={{ className: "global-class-name", size:'1em'}}>
                    <OverlayTrigger
                        placement="left"
                        overlay={
                        <Tooltip id={`tooltip-top`}>
                            Bookmark
                        </Tooltip> }>
                        <Link to='/favorites' style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            {location.pathname === '/favorites' ? <FaBookmark /> : <FaRegBookmark />}
                        </Link>
                    </OverlayTrigger>{' '}
                </IconContext.Provider>
                </Navbar.Brand>
                {location.pathname.substring(0,7) === '/search' || location.pathname.substring(0,10) === '/favorites' ?  false :
                <div>
                <Navbar.Brand className="text-white">NYTimes</Navbar.Brand>
                <Navbar.Brand className="text-white"><NavbarSwitch /></Navbar.Brand>
                <Navbar.Brand className="text-white">Guardian</Navbar.Brand>
                </div>}
                
            </Nav>

        </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarMenu;