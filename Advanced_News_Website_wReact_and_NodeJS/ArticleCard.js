import React from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap';
import './ArticleCard.css';
import Badge from 'react-bootstrap/Badge';
import ShareModal from '../ShareModal/ShareModal';
import Truncate from 'react-truncate';

const ArticleCard = (props) => {

    const checkImageWidth = (item) => {
        if(item.width >= 2000) {
            return item;
        }
    }
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
    const colorArray = ['world','politics','business','technology','sport','guardian','nytimes']
    let article;
    const guardianBackupImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    const nytBackupImage = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
    if(props.source) {
        article =  {
            id : props.article.id,
            imgUrl : props.article.blocks.main ? props.article.blocks.main.elements["0"].assets.length > 0 ? props.article.blocks.main.elements["0"].assets.pop().file : guardianBackupImage : guardianBackupImage,
            title : props.article.webTitle,
            text : props.article.blocks.body["0"].bodyTextSummary.length > 500 ? props.article.blocks.body["0"].bodyTextSummary.substring(0,500) + "..." : props.article.blocks.body["0"].bodyTextSummary,
            date : props.article.webPublicationDate.substring(0,10),
            section : props.article.sectionName,
            webUrl : props.article.webUrl
        }
    } else {
        console.log(props.article)
        article = {
            imgUrl : props.article.multimedia === null ? nytBackupImage :(props.article.multimedia.length > 0 && props.article.multimedia.find(checkImageWidth) ? props.article.multimedia.find(checkImageWidth).url : nytBackupImage) ,
            title : props.article.title,
            text : props.article.abstract,
            date : props.article.published_date.substring(0,10),
            section : props.article.section,
            webUrl : props.article.url       
        }
    }
    const badgeStyle = {
    background: colorArray.includes(article.section.toLowerCase()) ? colorMap[article.section.toLowerCase()][0] : colorMap.other[0],
    color: colorArray.includes(article.section.toLowerCase()) ? colorMap[article.section.toLowerCase()][1] : colorMap.other[1]
    };
    return(
        <>
        <Card className="card">
            <Container fluid>
                <Card.Body>
                    <Row>
                        <Col xs={12} lg={3}>
                            <Card.Img variant="top" src={article.imgUrl} /> 
                        </Col>
                        <Col>
                            <Card.Title>{article.title} <ShareModal title={article.title} webUrl={article.webUrl}/></Card.Title>
                            
                            <Card.Text>
                                <Truncate lines={4}>
                                    {article.text}
                                </Truncate>
                            </Card.Text>     
                            <Card.Title>{article.date} <Badge variant='primary' className='float-right' style={badgeStyle}>{article.section.toUpperCase()}</Badge> </Card.Title>
                        </Col>
                    </Row>
                </Card.Body>
            </Container>
        </Card>
        </>
    )
}

export default ArticleCard;