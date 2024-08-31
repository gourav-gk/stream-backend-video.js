import videojs from "video.js";

// Define the custom plugin
const resolutionSwitcher = function(options) {
  const player = this;

  // Create a custom class for the resolution switcher button
  class ResolutionMenuButton extends videojs.getComponent('MenuButton') {
    constructor() {
      super(player, options);
      this.controlText('Quality');
    }

    createItems() {
      const menuItems = [];

      options.sources.forEach(source => {
        const item = new videojs.getComponent('MenuItem')(player, {
          label: source.label,
          selectable: true,
          selected: source.src === player.currentSrc(),
          src: source.src
        });

        item.on('click', () => {
          player.src({ src: source.src, type: source.type });
        });

        menuItems.push(item);
      });

      return menuItems;
    }
  }

  // Register the button component with Video.js
  videojs.registerComponent('ResolutionMenuButton', ResolutionMenuButton);

  // Add the button to the control bar
  player.ready(() => {
    const buttonInstance = player.addChild('ResolutionMenuButton', options);
    player.controlBar.addChild(buttonInstance, {});
  });

  // Listen for resolution changes
  player.on('resolutionchange', () => {
    videojs.log('Resolution changed to', player.currentSrc());
  });
};

// Register the plugin with Video.js
videojs.registerPlugin('resolutionSwitcher', resolutionSwitcher);
