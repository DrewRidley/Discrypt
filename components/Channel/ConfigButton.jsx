const { React, getModule } = require ('powercord/webpack');
const { open } = require('powercord/modal');

const { Tooltip } = require('powercord/components');

const SettingsModal = require('./SettingsModal');

//Button related styling classes that discord uses for proper spacing.
const buttonWrapperClasses = getModule(["buttonWrapper", "pulseButton"], false);

class ConfigButton extends React.Component {
    render() {
        return (
            <Tooltip color="black" position="bottom" text="Configure encryption for this conversation.">
                <svg className={buttonWrapperClasses.icon} x="0" y="0" width="24" height="24" viewBox="0 0 24 24" onClick={() => {
                    open(() => React.createElement(SettingsModal, this.props));
                }}>
                <path fill="currentColor" d="M17,11V7c0-2.757-2.243-5-5-5S7,4.243,7,7v4c-1.103,0-2,0.896-2,2v7c0,1.103,0.897,2,2,2h10
            c1.103,0,2-0.897,2-2v-7C19,11.896,18.103,11,17,11z M12,18c-0.828,0-1.5-0.672-1.5-1.5S11.171,15,12,15s1.5,0.672,1.5,1.5
            S12.828,18,12,18z M15,11H9V7c0-1.654,1.346-3,3-3s3,1.346,3,3V11z"/>
                </svg>
            </Tooltip>
        );
    }
}

module.exports = ConfigButton;