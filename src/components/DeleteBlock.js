import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {deleteBlock} from "../util/db";

const DeleteBlock = props => {
    const { id } = props
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleDelete = () => {
        deleteBlock(id)
    }
    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Delete block
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Block?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting blocks cannot be undone. All data relating to this block will also be deleted.
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
        </>
    )
}

export default DeleteBlock
