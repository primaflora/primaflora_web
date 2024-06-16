export type TSignInModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onMoveToLogIn: () => void;
    inviteCode?: string;
};
