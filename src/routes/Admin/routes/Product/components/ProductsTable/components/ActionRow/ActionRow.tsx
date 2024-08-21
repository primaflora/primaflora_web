import './styles.css';
import { TActionRowProps } from './types';

export const ActionRow = ({ isHidden, onAction }: TActionRowProps) => {

    const handleAction = (action: string) => {
        onAction(action);
    }

    return (
        <div className='panel-table-action-row'>
            <button className='panel-approve-button' onClick={() => handleAction('edit')}>Edit</button>
            {
                isHidden 
                ? <button 
                    className='panel-approve-button' 
                    onClick={() => handleAction('publish')}>Publish</button>
                : <button 
                    className='panel-reject-button'
                    onClick={() => handleAction('hide')} >Hide</button>
            }
            <button className='panel-reject-button' onClick={() => handleAction('delete')}>Delete</button>
        </div>
    );
}