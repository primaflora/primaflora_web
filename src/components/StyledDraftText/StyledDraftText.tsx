import { convertFromRaw, Editor, EditorState } from "draft-js";
import { StyledDraftTextProps } from "./types";
import 'draft-js/dist/Draft.css';
import './styles.css';
import { CustomStyleMap } from "../../routes/Admin/components/CreateProduct/components/DescriptionEditor/types";

export const StyledDraftText = ({ rawState }: StyledDraftTextProps) => {
    let contentState;
    try {
        contentState = convertFromRaw(rawState);
    } catch {
        return renderDescription(rawState);
    }

    const editorState = EditorState.createWithContent(contentState);

    return editorState ? (
        <div className="draft-editor-container">
            <Editor 
                editorState={editorState} 
                readOnly={true} 
                onChange={() => {}} customStyleMap={CustomStyleMap} />
        </div>
    ) : renderDescription(rawState);
}

// RENDER DESCRIPTION OLD
export const renderDescription = (desc: Object) => {
    const formatKey = (key: string): string => {
        if (!key) return '';

        const res = key.replace(/_/g, ' ');
        return res.charAt(0).toUpperCase() + res.slice(1);
    };

    const formatValue = (value: string): string => {
        if (!value) return '';

        if (typeof value === 'object') {
            return 'object type';
        }

        if (typeof value === 'boolean') {
            return value ? 'Так' : 'Ні';
        }

        return value;
    };

    return (
        <div>
            {Object.entries(desc).map(([key, value]) => {
                // if array
                if (typeof value === 'object' && Array.isArray(value)) {
                    console.log('Is Array');
                    return (
                        <div className="pb-4">
                            <strong>{formatKey(key)}</strong>:
                            <ul className="pl-4 list-disc list-inside">
                                {value.map((item, index) => (
                                <li key={index} className="text-justify break-words">{item}</li>
                                ))}
                            </ul>
                        </div>
                    );
                }

                // if object
                if (typeof value === 'object') {
                    return renderDescription(value);
                }

                return (
                    <h4 className="pb-2">
                        <strong>{formatKey(key)}</strong>: {formatValue(value)}
                    </h4>
                );
            })}
        </div>
    );
};
