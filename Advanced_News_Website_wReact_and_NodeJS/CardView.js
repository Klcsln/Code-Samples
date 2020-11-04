import React, {useState, useEffect} from 'react';
import ArticleCard from '../ArticleCard/ArticleCard';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import { Link } from 'react-router-dom';
// /api/g-sections/:section

function CardView (props) {

    const [articles, setArticles] = useState([])
    const [isGuardian] = useState(JSON.parse(localStorage.getItem("isGuardian")));

    const override = css`
        display: block;
        margin: 0 auto;
        margin-top: 10%;
  `;

    useEffect(() => {
        const fetchGuardianData = async () => {
            const url = props.name === "home" ? "https://hw8-nodeserver-571.wl.r.appspot.com/api/g-home" :`https://hw8-nodeserver-571.wl.r.appspot.com/api/g-sections/${props.name}`;
            const req = await fetch(url);
            const res = await req.json();
            return res.response.results;
            
        }

        const fetchNYTData = async () => {
            let url = props.name === "home" ? "https://hw8-nodeserver-571.wl.r.appspot.com/api/nyt-home"  :`https://hw8-nodeserver-571.wl.r.appspot.com/api/nyt-sections/${props.name}`;
            if(props.name === 'sport'){
                url = `https://hw8-nodeserver-571.wl.r.appspot.com/api/nyt-sections/${props.name}s`
            }
            const req = await fetch(url);
            const res = await req.json();
            return res.results.slice(0,10);
        }
        setArticles([])
        isGuardian ? 
            fetchGuardianData().then(result => {
                setArticles(result);
            }) : 
            fetchNYTData().then(result => {
                setArticles(result);
            })
      }, [props.name, isGuardian]);
    

    if(!articles.length) return (<BounceLoader css={override} size={40} color={"blue"}/>);
    return (
    articles.map( article => {
        return (
        <React.Fragment key= {isGuardian? article.id : article.url}>
            <Link to={{
                pathname:`/detail/${isGuardian? article.id : article.url.replace(/\/\//g, '/')}`,
                state: article
                }} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                <ArticleCard article={article} source={isGuardian}/>
            </Link>
        </React.Fragment>
        )
    })
    
    )
}


export default CardView;