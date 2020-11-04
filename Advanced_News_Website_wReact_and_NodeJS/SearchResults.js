import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Card, Container, Row, Col } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import ShareModal from '../ShareModal/ShareModal'
import Truncate from 'react-truncate'
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

const override = css`
        display: block;
        margin: 0 auto;
        margin-top: 10%;
    `;

function SearchResults () {

    let location = useLocation();
    let queryWord = location.pathname.substring(1)
    const guardianBackupImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    const [articles, setArticles] = useState([])

    const colorMap = {
        world: ['#7c4eff', 'white'],
        politics: ['#419488', 'white'],
        business: ['#4696ec', 'white'],
        technology: ['#cedc39', 'black'],
        sport: ['#f6c244', 'black'],
        other: ['#6e757c', 'white']
    }
    const colorArray = ['world','politics','business','technology','sport'];

    const fetchData = async () => {
        const url = `https://hw8-nodeserver-571.wl.r.appspot.com/api/g-search/?search=${queryWord}`;
        const req = await fetch(url);
        const res = await req.json();
        return res;
    }

    useEffect(() => {
        fetchData().then(result => {
            let articles = [];
            result.response.results.map(item => {
                articles.push({
                    id: item.id,
                    title: item.webTitle,
                    webUrl: item.webUrl,
                    date: item.webPublicationDate.substring(0,10),
                    section: item.sectionName,
                    badgeStyle: {
                        background: colorArray.includes(item.sectionName.toLowerCase()) ? colorMap[item.sectionName.toLowerCase()][0] : colorMap.other[0],
                        color: colorArray.includes(item.sectionName.toLowerCase()) ? colorMap[item.sectionName.toLowerCase()][1] : colorMap.other[1]
                    },
                    imgUrl:item.blocks.main ? item.blocks.main.elements["0"].assets.length > 0 ? item.blocks.main.elements["0"].assets[item.blocks.main.elements["0"].assets.length - 1].file : guardianBackupImage : guardianBackupImage,
                    text: item.blocks.body['0'].bodyTextSummary
                })
            })
            setArticles(articles)
        })
    },[])

    if(articles.length === 0) { return (<BounceLoader css={override} size={40} color={"blue"}/>) }

    return(
        <>
        <Container fluid>
        <div style={{color:'black', fontSize: '28px', textAlign:'left', marginTop:'10px'}}>Results</div>
        <Row>
            {articles.map(item => {
                return(
                    <Col xs={12} lg={3} key={item.id}>
                    <Link to={{
                        pathname: `/detail/${item.id}`,
                        state: item
                        }} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    <Card xs={12} lg={3} >
                    <Card.Body>
                        <Card.Title>
                            <Truncate lines={2}>
                                {item.title}
                            </Truncate>
                            <ShareModal title={item.title} webUrl={item.webUrl}/>
                        </Card.Title>
                        <Card.Img variant="top" src={item.imgUrl}/>
                        <Card.Title style={{marginTop:'10px'}}>
                        <em>{item.date}</em>
                        <Badge variant='primary' className='float-right' style={item.badgeStyle}>{item.section.toUpperCase()}</Badge>
                        </Card.Title>
                    </Card.Body>
                    </Card>
                    </Link>
                    </Col>
                )
            })}
        </Row>
        </Container>
        </>
    )
}

export default SearchResults;