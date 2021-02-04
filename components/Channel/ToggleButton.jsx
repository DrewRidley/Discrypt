const { React, getModule, getModuleByDisplayName } = require ('powercord/webpack');
const { open } = require('powercord/modal');

//Component related imports.
const Tooltip = getModuleByDisplayName("Tooltip", false);
const { Button } = require ('powercord/components');
const SettingsModal = require('./SettingsModal');

//Button related styling classes that discord uses for proper spacing.
const buttonClasses = getModule(["button"], false);
const buttonWrapperClasses = getModule(["buttonWrapper", "pulseButton"], false);
const buttonTextAreaClasses = getModule(["button", "textArea"], false);

class ToggleButton extends React.Component {
    constructor(props) {
        super(props);
      }

    render() {
        let chn = this.props.settings.get('keyStore', {})[this.props.channel];

        if(chn == undefined) {
            return (
                <Tooltip color="black" postion="top" text="Configure encryption for this conversation.">
                {({ onMouseLeave, onMouseEnter }) => (
                    <Button
                        onClick={() => {
                            open(() => React.createElement(SettingsModal, this.props));
                        }}
                        look={Button.Looks.BLANK}
                        size={Button.Sizes.ICON}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{padding: "0px", width: "40px", height: "44px", margin: "0px"}}
                    >
                    <div className={`${buttonClasses.contents} ${buttonWrapperClasses.button} ${buttonTextAreaClasses.button} lock-icon-div`}>
                        <svg className={buttonWrapperClasses.icon} x="0" y="0" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17,11H9V7c0-1.654,1.346-3,3-3s3,1.346,3,3v1h2V7c0-2.757-2.243-5-5-5S7,4.243,7,7v4c-1.103,0-2,0.896-2,2
        v7c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2v-7C19,11.896,18.103,11,17,11z M12,18c-0.828,0-1.5-0.672-1.5-1.5S11.172,15,12,15
        s1.5,0.672,1.5,1.5S12.828,18,12,18z"/>
                        </svg>
                    </div>

                    </Button>
                )}
            </Tooltip>
            );
        }
        else
        {
            if(chn.encrypt) {
                return (
                    <Tooltip color="black" postion="top" text="Disable the sending of encrypted content">
                    {({ onMouseLeave, onMouseEnter }) => (
                        <Button
                            onClick={() => {
                                this.forceUpdate();
                                
                            }}
                            look={Button.Looks.BLANK}
                            size={Button.Sizes.ICON}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            style={{padding: "0px", width: "40px", height: "44px", margin: "0px"}}
                        >
                        <div className={`${buttonClasses.contents} ${buttonWrapperClasses.button} ${buttonTextAreaClasses.button} lock-icon-div`}>
                            <svg className={buttonWrapperClasses.icon} x="0" y="0" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17,11V7c0-2.757-2.243-5-5-5S7,4.243,7,7v4c-1.103,0-2,0.896-2,2v7c0,1.103,0.897,2,2,2h10
            c1.103,0,2-0.897,2-2v-7C19,11.896,18.103,11,17,11z M12,18c-0.828,0-1.5-0.672-1.5-1.5S11.171,15,12,15s1.5,0.672,1.5,1.5
            S12.828,18,12,18z M15,11H9V7c0-1.654,1.346-3,3-3s3,1.346,3,3V11z"/>
                            </svg>
                        </div>

                        </Button>
                    )}
                </Tooltip>
                );
            }
            else {
                return (
                    <Tooltip color="black" postion="top" text="Enable the sending of encrypted content">
                        {({ onMouseLeave, onMouseEnter }) => (
                            <Button
                                onClick={() => {
                                    this.forceUpdate();
                                }}
                                look={Button.Looks.BLANK}
                                size={Button.Sizes.ICON}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                style={{padding: "0px", width: "40px", height: "44px", margin: "0px"}}
                            >
                            <div className={`${buttonClasses.contents} ${buttonWrapperClasses.button} ${buttonTextAreaClasses.button} lock-icon-div`}>
                                <svg className={buttonWrapperClasses.icon} x="0" y="0" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M17,11H9V7c0-1.654,1.346-3,3-3s3,1.346,3,3v1h2V7c0-2.757-2.243-5-5-5S7,4.243,7,7v4c-1.103,0-2,0.896-2,2
            v7c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2v-7C19,11.896,18.103,11,17,11z M12,18c-0.828,0-1.5-0.672-1.5-1.5S11.172,15,12,15
            s1.5,0.672,1.5,1.5S12.828,18,12,18z"/>
                                </svg>
                            </div>

                            </Button>
                        )}
                    </Tooltip>
                );
            }
        }
    }
}

module.exports = ToggleButton;