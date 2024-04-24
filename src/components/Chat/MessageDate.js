import React from 'react';
import DateUtils from "../Utils/DateUtils";

export const isFirstMessageOfDay = (index, messages) => {
    if (index === 0) return true; // The first message of the chat is always the first of its day

    const currentDate = new Date(messages[index].createdAt);
    const previousDate = new Date(messages[index - 1].createdAt);

    return currentDate.getDate() !== previousDate.getDate() ||
        currentDate.getMonth() !== previousDate.getMonth() ||
        currentDate.getFullYear() !== previousDate.getFullYear();
};

const MessageDate = ({ index, messages }) => {
    if (isFirstMessageOfDay(index, messages)) {
        return <div className="date">{DateUtils.formatDate(messages[index].createdAt)}</div>;
    }
    return null;
};

export default MessageDate;