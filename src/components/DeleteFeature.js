import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {deleteFeature} from "../util/db";
import Container from "react-bootstrap/Container";

const DeleteFeature = props => {
    const { id } = props
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleDelete = () => {
        deleteFeature(id)
    }
    return (
        <Container className="text-center">
            <div className={'deleteBtn'}>
                <Button variant="danger" onClick={handleShow}>
                    Delete feature
                </Button>
            </div>


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Feature?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting features of blocks cannot be undone. All data relating to this feature will also be deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default DeleteFeature
