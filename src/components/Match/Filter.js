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
        handleOpenModal() {
            handleOpen();
        }
    }));

    const onSubmit = (data) => {
        handleClose();
    };

    return (
        <div>
            filete
        </div>
    );
};

Filter.propTypes = {};

export default Filter;
