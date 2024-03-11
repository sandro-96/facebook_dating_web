import React, { useState } from 'react';
import './index.scss';
import Modal from '@mui/material/Modal';
const Filter = ({ filterRef }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = (event) => {
        setOpen(false);
    };

    React.useImperativeHandle(filterRef, () => ({
        handleOpenModal(employeeId) {
            handleOpen();
        }
    }));

    const onSubmit = (data) => {
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} disableEnforceFocus={true} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <div>dsdasdasasd</div>
        </Modal>
    );
};

Filter.propTypes = {};

export default Filter;
