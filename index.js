const { Plugin } = require ('powercord/entities');
const { React, getModule, getModuleByDisplayName, FluxDispatcher, channels } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require("powercord/util");

//Import of components.
const ToggleButton = require('./components/Channel/ToggleButton');
const ConfigButton = require('./components/Channel/ConfigButton');
const { Tooltip } = require('powercord/components');

var aes256 = require('aes256');

const ChannelTextAreaContainer = getModule(
	(m) => m.type && m.type.render && m.type.render.displayName === "ChannelTextAreaContainer", false
);

const MessageContent = getModule(m => (m.__powercordOriginal_type || m.type)?.displayName === 'MessageContent', false);

module.exports = class DisCrypt extends Plugin {

    //Called when the plugin starts.
    async startPlugin() {
        //Load the css stylesheet.
        this.loadStylesheet('styles.css');

        //Inject the services.
        await this.injectServices();
    }

    //Injects all required services into discord.
    async injectServices() {

        //The button placed in the text-box where you can toggle the sending of encrypted messages.
        inject('encrypt-toggle', ChannelTextAreaContainer.type, 'render', (args, res) => {
            let keyStorage = this.settings.get('keyStore', {});

            let chn = channels.getChannelId();

            //Investigate replacing this with `this.getChannel(res.props.children[1].key)`
            const props = findInReactTree(res, r => r && r.className && r.className.indexOf("buttons-") === 0);

            
            const div = React.createElement("div", {
                className: "discrypt-toggle",
                onClick: () => {
                    if(keyStorage[chn] != null) {
                        keyStorage[chn].encrypt = !keyStorage[chn].encrypt;
                        this.settings.set('keyStore', keyStorage);
                    }
                }
            }, React.createElement(ToggleButton, { settings: this.settings, channel: chn}));


            props.children.unshift(div);
            

            return res;
        });

        //Required by powercord after the injection.
        ChannelTextAreaContainer.type.render.displayName =
        "ChannelTextAreaContainer";


        //A prerequisite to the button placed on the channel header, used for changing encryption settings.
       const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer');
               
        inject('channel-settings', HeaderBarContainer.prototype, 'renderLoggedIn', (args, res) => {
            let keyStorage = this.settings.get('keyStore', {});

            let chn = channels.getChannelId();
            
            if(keyStorage[chn] != null) {
                const div = React.createElement("div", {
                    className: "discrypt-config", 
                }, React.createElement(ConfigButton, { settings: this.settings, channel: chn}));
                
                res.props.toolbar.props.children.unshift(div);
            }
        
            return res;
        });

        
        //The message decryption service which decrypts and renders any encrypted messages that match the password.
        inject("message-decrypt", MessageContent, "type", (args) => {
            let chn = this.settings.get('keyStore', {})[channels.getChannelId()];

            if(chn != null && chn.decrypt) {
                //Now, try to effficiently evaluate whether the message is encrypted.
                if(args[0].message.content.startsWith("discrypt-"))
                {
                    //A standard aes256 encrypted message is present.
                    let decrypted = aes256.decrypt(chn.secret, args[0].message.content.replace("discrypt-", "")) + " (🔒)";
                    args[0].message.content = decrypted;
                    args[0].content[0] = decrypted;
                    FluxDispatcher.dirtyDispatch({
                        type: 'MESSAGE_UPDATE',
                        message: args[0].message
                    });
                }
            }

            return args;

            //Useless comment here.

        }, true);
        MessageContent.type.displayName = "MessageContent";

        //The message encryption service which (if encryption is enabled), modifies and encrypts outbound messages.
        inject('message-encrypt', require('powercord/webpack').messages, 'sendMessage', (message) => {
            let chn = this.settings.get('keyStore', {})[channels.getChannelId()];
            if(chn != null && chn.encrypt) {
                message[1].content = "discrypt-" + aes256.encrypt(chn.secret, message[1].content);
                return message;
            }

            return message;
        }, true);
    }

    //Uninjects and disables any services.
    async uninjectServices() {
        uninject('channel-settings');
        uninject('encrypt-toggle');
        uninject('message-encrypt');
        uninject('message-decrypt');
    }

    async pluginWillUnload() {
        await this.uninjectServices();
    }
}