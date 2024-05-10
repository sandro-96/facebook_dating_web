import "./index.scss"
import React from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

const FeedbackModal = (props) => {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, formState: {errors} } = useForm(
        {defaultValues: {content: ''}}
    );
    const onSubmit = data => {
        props.saveFeedback(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-2">
            <div className="form-group">
                <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    placeholder={t('setting.max300')}
                    {...register('content')}
                    maxLength={300}
                    style={{ height: '200px' }}
                />
            </div>
            <div className="d-flex gap-2 w-100 flex-row-reverse">
                <button type="submit" className="btn btn-primary">{t('common.create')}</button>
                <button type="button" className="btn btn-secondary" onClick={() => props.cancel()}>{t('common.cancel')}</button>
            </div>
        </form>
    )
}

export default FeedbackModal;