import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';

class AlertPopup {
    static confirm(message, okLabel, cancelLabel, onOk ) {
        confirmAlert({
            closeOnClickOutside: false,
            customUI: ({ onClose }) => {
                return (
                    <div className='react-confirm-alert-body warning'>
                        {message}
                        <div className='react-confirm-alert-button-group'>
                            <button onClick={() => {
                                onOk();
                                onClose();
                            }}>Ok</button>
                            <button onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                );
            }
        });
    }
    static alert({ message, okLabel}) {
        confirmAlert({
            closeOnClickOutside: false,
           customUI: ({ onClose }) => {
                return (
                    <div className='react-confirm-alert-body confirm'>
                        {message}
                        <div className='react-confirm-alert-button-group'>
                            <button onClick={onClose}>{okLabel}</button>
                        </div>
                    </div>
                );
            }
        });
    }
}

export default AlertPopup;