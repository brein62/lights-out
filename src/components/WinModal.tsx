import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";

export default function WinModal({ show, handleClose, moves } : { show : boolean, handleClose : () => void, moves : number }) {

    return (   
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Good job! Moves: <strong>{ moves }</strong></Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}