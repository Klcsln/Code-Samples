import React, {useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, TwitterShareButton , TwitterIcon} from "react-share";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import { FaRegBookmark, FaBookmark} from 'react-icons/fa';
import Truncate from 'react-truncate';
import { IconContext } from "react-icons";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import commentBox from 'commentbox.io';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ArticleDetail.css';
const ArticleDetail = (props) => {
    console.log(props)
    const [expanded, setExpanded] = useState(false);
    const [article, setArticle] = useState({});
    const [bookmarked, setBookmarked] = useState(false);
    const passedArticle = props.location.state;
    let removeCommentBox;
    const guardianBackupImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    const nytBackupImage = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
    const toggleExpansion = () => {
        setExpanded(!expanded);
        const element = document.querySelector('#bottom');
        setTimeout(() => {
            element.scrollIntoView({behavior: "smooth"});
          }, 50);
    }

    const checkImageWidth = (item) => {
        if(item.width >= 2000) {
            return item;
        }
    }

    let isGuardian;
    let urlPath;
    let nytImage;
    if(props.location.state.article === undefined) {
        if(passedArticle.hasOwnProperty('id')){
            isGuardian = true
        } else { isGuardian = false}
        nytImage = isGuardian? "": passedArticle.multimedia.length > 0 && passedArticle.multimedia.find(checkImageWidth) ? passedArticle.multimedia.find(checkImageWidth).url : nytBackupImage
        urlPath = isGuardian ? passedArticle.id : passedArticle.url
    } else {
        isGuardian = props.location.state.article.isGuardian
        urlPath = isGuardian ? props.location.state.article.data.webUrl.substring(28): props.location.state.article.data.webUrl
        nytImage = props.location.state.article.data.imgUrl
        
    }

    useEffect(() => {
        removeCommentBox = commentBox('5683994666467328-proj');
        setBookmarked(localStorage.getItem(props.match.url) !== null)
        return () => removeCommentBox();
    })

    useEffect(() => {
        const fetchGuardianData = async () => {
            const url = `https://hw8-nodeserver-571.wl.r.appspot.com/api/g-detail/?id=${urlPath}`;
            const req = await fetch(url);
            const res = await req.json();
            return res.response.content;
        }
        const fetchNYTData = async () => {
            const url = `https://hw8-nodeserver-571.wl.r.appspot.com/api/nyt-detail/?id=${urlPath}`;
            const req = await fetch(url);
            const res = await req.json();
            return res.response.docs['0'];
        }
        setArticle({})
        const fetchData = async () => {
            isGuardian ? 
            fetchGuardianData().then(result => {
                setArticle(result);
            }) : 
            fetchNYTData().then(result => {
                setArticle(result);
            })
        }
        
        fetchData();
    }, [isGuardian, passedArticle.id,passedArticle.url])

    const override = css`
        display: block;
        margin: 0 auto;
        margin-top: 10%;
    `;
    
    let data;
    if(Object.keys(article).length !== 0) { 
        isGuardian ? 
            data = {
                imgUrl : article.blocks.main ? article.blocks.main.elements["0"].assets.length > 0 ? article.blocks.main.elements["0"].assets[article.blocks.main.elements["0"].assets.length - 1].file : guardianBackupImage : guardianBackupImage,
                title : article.webTitle,
                text : article.blocks.body['0'].bodyTextSummary,
                date : article.webPublicationDate.substring(0,10),
                section : article.sectionName,
                webUrl : article.webUrl
        } :
            data = {
                imgUrl : nytImage,
                title : article.headline.main,
                text : article.abstract,
                date : article.pub_date.substring(0,10),
                section : article.section_name,
                webUrl : article.web_url       
        }
    }

    const handleBookmark = () => {
        const bookmarkItem = {
            data: data,
            isGuardian: isGuardian
        }
        
        if(!bookmarked){
            localStorage.setItem(props.match.url,JSON.stringify(bookmarkItem));            
            setBookmarked(!bookmarked);
            toast(`Saving ${data.title}`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true
                });
        } else{
            localStorage.removeItem(props.match.url)            
            setBookmarked(!bookmarked);
            toast(`Removing ${data.title}`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true
                });
        }
    }
    if(Object.keys(article).length === 0) { return (<BounceLoader css={override} size={40} color={"blue"}/>) }

    return(
    <>
    <Card className="card">
        <Container fluid>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Title>{data.title} </Card.Title>
                        <Card.Text>
                        <em>{data.date}</em>
                            <span style={{float:'right', marginBottom:'10px'}}>
                            <OverlayTrigger
                                overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Facebook
                                </Tooltip> }>
                                <FacebookShareButton children={<FacebookIcon size={32} round={true} />} url={data.webUrl} hashtag={'#CSCI_571_Homework8'}/>
                            </OverlayTrigger>{' '}
                            <OverlayTrigger
                                overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Twitter
                                </Tooltip> }>
                                <TwitterShareButton children={<TwitterIcon size={32} round={true}/>} url={data.webUrl} hashtags={['CSCI_571_Homework8']}/>
                            </OverlayTrigger>{' '}
                            <OverlayTrigger
                                overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Email
                                </Tooltip> }>
                                <EmailShareButton children={<EmailIcon size={32} round={true}/>} url={data.webUrl} subject={'#CSCI_571_Homework8'} />
                            </OverlayTrigger>{' '}
                            <IconContext.Provider value={{ color: "red", className: "global-class-name", size:'2em'}}>
                                <OverlayTrigger
                                    overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Bookmark
                                    </Tooltip> }>
                                        {bookmarked ? <FaBookmark onClick={handleBookmark} /> : <FaRegBookmark onClick={handleBookmark} />}
                                </OverlayTrigger>{' '}
                            </IconContext.Provider>
                            </span>
                        </Card.Text>
                        <Card.Img variant="top" src={data.imgUrl} /> 
                        <Card.Text>
                        <Truncate lines={!expanded && 4}>
                            {data.text}
                        </Truncate>
                            <span style={{display: 'flex', justifyContent: 'flex-end', marginTop:'10px', fontSize:'32px'}} >
                                {expanded ? <MdKeyboardArrowUp onClick={toggleExpansion}/> : <MdKeyboardArrowDown onClick={toggleExpansion}/>}
                            </span>
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Container>
    </Card>
    <span id="bottom"></span>
    <div className="commentbox" />
    <ToastContainer toastClassName='toastBackground' />
    </>
    )
}

export default ArticleDetail