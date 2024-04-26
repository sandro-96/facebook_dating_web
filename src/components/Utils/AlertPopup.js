import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';

class AlertPopup {
    static confirm( title, message, okLabel, cancelLabel, onOk, onCancel ) {
        confirmAlert({
            title: title,
            message: message,
            closeOnClickOutside: false,
            buttons: [
                {
                    label: okLabel,
                    onClick: () => onOk()
                },
                {
                    label: cancelLabel,
                    onClick: () => onCancel
                }
            ]
        });
    }
    static alert({title, message, okLabel}) {
        confirmAlert({
            title: title,
            message: message,
            closeOnClickOutside: false,
            buttons: [
                {
                    label: okLabel
                }
            ]
        });
    }
}

export default AlertPopup;