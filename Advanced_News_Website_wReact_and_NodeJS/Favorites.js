import React, { useState} from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import ShareModal from '../ShareModal/ShareModal'
import { FaTrash } from 'react-icons/fa'
import Truncate from 'react-truncate'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './Favorites.css'
function Favorites () {

    const [bookmarks, setBookmarks] = useState(Object.keys(localStorage))


    const colorMap = {
        world: ['#7c4eff', 'white'],
        politics: ['#419488', 'white'],
        business: ['#4696ec', 'white'],
        technology: ['#cedc39', 'black'],
        sport: ['#f6c244', 'black'],
        other: ['#6e757c', 'white'],
        guardian: ['#14284a', 'white'],
        nytimes: ['#dddddd', 'black']
    }
    const guardianStyle = {
        background: '#14284a',
        color: 'white',
        margin: '5px'
    }
    const NYTStyle = {
        background: '#dddddd',
        color: 'black',
        margin: '5px'
    }
    
    const deleteArticle = (event,item) => {
        event.stopPropagation()
        event.preventDefault()
        const article = JSON.parse(localStorage.getItem(item));
        localStorage.removeItem(item);
        setBookmarks(Object.keys(localStorage))
        console.log(article)
        toast(`Removing ${article.data.title}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true
            });
    }
    const colorArray = ['world','politics','business','technology','sport','guardian','nytimes'];

    if(bookmarks.length === 1) return(<div style={{color:'black', fontSize: '28px', textAlign:'center'}}>You have no saved articles </div>)

    return(
        <>
        <Container fluid>
        <div style={{color:'black', fontSize: '28px', textAlign:'left', marginTop:'10px'}}>Favorites</div>
        <Row>
            {bookmarks.map(item => {
                if(item !== 'isGuardian') {
                    const article = JSON.parse(localStorage.getItem(item));
                    const badgeStyle = {
                        background: colorArray.includes(article.data.section.toLowerCase()) ? colorMap[article.data.section.toLowerCase()][0] : colorMap.other[0],
                        color: colorArray.includes(article.data.section.toLowerCase()) ? colorMap[article.data.section.toLowerCase()][1] : colorMap.other[1],
                        margin: '5px'
                        };
                    return(
                        
                            <Col xs={12} lg={3} key={item}>
                            <Link to={{
                            pathname: item,
                            state: { article }
                            }}
                            style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <Card xs={12} lg={3} >
                            <Card.Body>
                                <Card.Title>
                                    <Truncate lines={2}>
                                        {article.data.title}
                                    </Truncate>
                                    <ShareModal title={article.data.title} webUrl={article.data.webUrl}/>
                                    <FaTrash style={{fontSize:'0.8em', marginLeft: '5px'}} onClick={(event) => deleteArticle(event,item)}/>
                                </Card.Title>
                                <Card.Img variant="top" src={article.data.imgUrl}/>
                                <Card.Title style={{marginTop:'10px'}}>
                                <em>{article.data.date}</em>
                                <Badge variant='primary' className='float-right' style={article.isGuardian ? guardianStyle : NYTStyle}>{article.isGuardian ? 'GUARDIAN' : 'NYTIMES'}</Badge>
                                <Badge variant='primary' className='float-right' style={badgeStyle}>{article.data.section.toUpperCase()}</Badge>
                                </Card.Title>
                            </Card.Body>
                            </Card>
                            </Link>
                            </Col>
                    )
                } 
            })}
        </Row>
        </Container>
        <ToastContainer toastClassName='toastBackground' />
        </>
    )
}

export default Favorites;