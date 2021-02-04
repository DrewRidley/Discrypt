const { React } = require ('powercord/webpack');

const { close: closeModal } = require('powercord/modal');
const { Modal } = require('powercord/components/modal');
const { FormTitle, Button } = require('powercord/components');
const {
    TextAreaInput,
    SwitchItem,
    Category
} = require('powercord/components/settings');

class SettingsModal extends React.Component {
    constructor(props) {
        super(props);
        this.keyStorage = this.props.settings.get('keyStore', {});
        this.state = this.keyStorage[this.props.channel]; 
        if(this.state == null) {
            this.state = {
                secret: '',
                decrypt: false,
                encrypt: true
            }
        }

    }

    updateConf() {
        //Update local cache.
        this.keyStorage = this.props.settings.get('keyStore', {});

        //Update the channel's state.
        this.keyStorage[this.props.channel] = this.state;

        //Submit update to the store.
        this.props.settings.set('keyStore', this.keyStorage);
    }

    render() {
        return (
            <Modal className="powercord-text">
                <Modal.Header>
                    <FormTitle tag="h4">Channel Encryption Settings</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <TextAreaInput value={this.state.secret} type="password" rows={1}  onChange={async (m) => { await this.setState({secret: m}); }} >
                        Password
                    </TextAreaInput>
                    <SwitchItem note="Automatically decrypts inbound messages." value={this.state.decrypt} onChange={async (m) => { await this.setState({decrypt: m}); }}>
                    Automatic decryption
                    </SwitchItem>
                </Modal.Content>
                <Modal.Footer>
                    <Button color={Button.Colors.GREEN} onClick={() => {
                        this.updateConf();
                        closeModal();
                    }}>
                        Save Changes
                    </Button> 
                    <Button style={{marginRight: "10px"}} color={Button.Colors.RED}  onClick={() => {
                        this.keyStorage = this.props.settings.get('keyStore', {});
                        this.keyStorage[this.props.channel] = null;
                        this.props.settings.set('keyStore', this.keyStorage);
                        closeModal();
                    }}>
                        Forget configuration
                    </Button> 
                    <Button color={Button.Colors.TRANSPARENT} look={Button.Looks.LINK} onClick={closeModal}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

module.exports = SettingsModal;