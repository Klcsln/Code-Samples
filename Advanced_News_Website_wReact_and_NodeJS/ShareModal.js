import React, {useState, setShow } from 'react';
import Modal from 'react-bootstrap/Modal';
import { MdShare } from 'react-icons/md';

import { EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, TwitterShareButton , TwitterIcon} from "react-share";

function ShareModal(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = (e) => {
        setShow(false);
    }
    const handleShow = (e) => {
        setShow(true);
        e.stopPropagation();
        e.preventDefault();
    }
    return (
      <span onClick={e => { e.stopPropagation(); e.preventDefault();}}>
      <MdShare onClick={handleShow}/>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton onClick={e => { e.stopPropagation(); e.preventDefault();}}>
            <Modal.Title><h5>{props.title}</h5></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{textAlign:"center"}} >Share via
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop:'10px'}}>
            <FacebookShareButton children={<FacebookIcon size={54} round={true} />} url={props.webUrl} hashtag={'#CSCI_571_Homework8'}/>
            <TwitterShareButton children={<TwitterIcon size={54} round={true}/>} url={props.webUrl} hashtags={['CSCI_571_Homework8']}/>
            <EmailShareButton children={<EmailIcon size={54} round={true}/>} url={props.webUrl} subject={'#CSCI_571_Homework8'}/>
          </div>
          </Modal.Body>

        </Modal>

      </span>
    );
  }
  
  export default ShareModal;