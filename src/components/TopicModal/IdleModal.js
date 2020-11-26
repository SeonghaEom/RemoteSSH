import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const IdleTimeOutModal = ({showModal, handleClose}) => {

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Topic Suggestions</Modal.Title>
            </Modal.Header>
            <Modal.Body>This is the Topic</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
                Like
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Exit
            </Button>
            </Modal.Footer>
        </Modal>
    )
}