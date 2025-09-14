/**
 * Image Tool for the Editor.js
 * @author CodeX <team@codex.so>
 * @license MIT
 * @see {@link https://github.com/editor-js/image}
 *
 * To developers.
 * To simplify Tool structure, we split it to 4 parts:
 *  1) index.ts — main Tool's interface, public API and methods for working with data
 *  2) uploader.ts — module that has methods for sending files via AJAX: from device, by URL or File pasting
 *  3) ui.ts — module for UI manipulations: render, showing preloader, etc
 *
 * For debug purposes there is a testing server
 * that can save uploaded files and return a Response {@link UploadResponseFormat}
 *
 *       $ node dev/server.js
 *
 * It will expose 8008 port, so you can pass http://localhost:8008 with the Tools config:
 *
 * image: {
 *   class: ImageTool,
 *   config: {
 *     endpoints: {
 *       byFile: 'http://localhost:8008/uploadFile',
 *       byUrl: 'http://localhost:8008/fetchUrl',
 *     }
 *   },
 * },
 */

import type { TunesMenuConfig } from '@editorjs/editorjs/types/tools';
import type { API, ToolboxConfig, PasteConfig, BlockToolConstructorOptions, BlockTool, BlockAPI, PasteEvent, PatternPasteEventDetail, FilePasteEventDetail } from '@editorjs/editorjs';
import './index.css';

import Ui, { tablerIcons } from './ui';
import Uploader from './uploader';

import type { ActionConfig, UploadResponseFormat, ImageToolData, ImageConfig, HTMLPasteEventDetailExtended, ImageSetterParam, FeaturesConfig } from './types/types';

type ImageToolConstructorOptions = BlockToolConstructorOptions<ImageToolData, ImageConfig>;

/**
 * Implementation of ImageTool class
 */
export default class ImageTool implements BlockTool {
  /**
   * Editor.js API instance
   */
  private api: API;

  /**
   * Current Block API instance
   */
  private block: BlockAPI;

  /**
   * Configuration for the ImageTool
   */
  private config: ImageConfig;

  /**
   * Uploader module instance
   */
  private uploader: Uploader;

  /**
   * UI module instance
   */
  private ui: Ui;

  /**
   * Stores current block data internally
   */
  private _data: ImageToolData;

  /**
   * Caption enabled state
   * Null when user has not toggled the caption tune
   * True when user has toggled the caption tune
   * False when user has toggled the caption tune
   */
  private isCaptionEnabled: boolean | null = null;

  /**
   * Link enabled state
   * True when user has toggled the link tune
   * False when user has toggled the link tune
   */
  private isLinkEnabled: boolean | null = null;

  /**
   * @param tool - tool properties got from editor.js
   * @param tool.data - previously saved data
   * @param tool.config - user config for Tool
   * @param tool.api - Editor.js API
   * @param tool.readOnly - read-only mode flag
   * @param tool.block - current Block API
   */
  constructor({ data, config, api, readOnly, block }: ImageToolConstructorOptions) {
    this.api = api;
    this.block = block;

    /**
     * Tool's initial config
     */
    this.config = {
      endpoints: config.endpoints,
      additionalRequestData: config.additionalRequestData,
      additionalRequestHeaders: config.additionalRequestHeaders,
      field: config.field,
      types: config.types,
      captionPlaceholder: this.api.i18n.t(config.captionPlaceholder ?? 'Enter a caption...'),
      buttonContent: config.buttonContent,
      uploader: config.uploader,
      actions: config.actions,
      features: config.features || {},
    };

    /**
     * Module for file uploading
     */
    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response: UploadResponseFormat) => this.onUpload(response),
      onError: (error: string) => this.uploadingFailed(error),
    });

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      onSelectFile: () => {
        this.uploader.uploadSelectedFile({
          onPreview: (src: string) => {
            this.ui.showPreloader(src);
          },
        });
      },
      readOnly,
    });

    /**
     * Set saved state
     */
    this._data = {
      caption: '',
      withBorder: false,
      withBackground: false,
      size: 'full',
      alignment: 'center',
      linkUrl: '',
      file: {
        url: '',
      },
    };

    // Set default toggle states
    this.isCaptionEnabled = true; // Caption enabled by default
    this.isLinkEnabled = true; // Link enabled by default
    this.data = data;
  }

  /**
   * Notify core that read-only mode is supported
   */
  public static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  public static get toolbox(): ToolboxConfig {
    return {
      icon: tablerIcons.photo,
      title: 'Image',
    };
  }

  /**
   * Available image tools
   */
  public static get tunes(): Array<ActionConfig> {
    return [
      {
        name: 'withBorder',
        icon: tablerIcons.border,
        title: 'With border',
        toggle: true,
      },
      {
        name: 'withBackground',
        icon: tablerIcons.palette,
        title: 'With background',
        toggle: true,
      },
      {
        name: 'linkUrl',
        icon: tablerIcons.link,
        title: 'With Link',
        toggle: true,
      },
    ];
  }

  /**
   * Renders Block content
   */
  public render(): HTMLDivElement {
    if (this.config.features?.caption === true || this.config.features?.caption === undefined || (this.config.features?.caption === 'optional' && this.data.caption)) {
      this.isCaptionEnabled = true;
      this.ui.applyTune('caption', true);
    }

    // Initialize link as disabled by default unless there's existing data
    if (this.data.linkUrl) {
      this.isLinkEnabled = true;
      this.ui.toggleLinkInput(true);
    } else {
      this.isLinkEnabled = false;
      this.ui.toggleLinkInput(false);
    }

    // Apply initial size and alignment from data
    if (this.data.size) {
      this.ui.applySize(this.data.size);
    }
    if (this.data.alignment) {
      this.ui.applyAlignment(this.data.alignment);
    }

    return this.ui.render() as HTMLDivElement;
  }

  /**
   * Validate data: check if Image exists
   * @param savedData — data received after saving
   * @returns false if saved data is not correct, otherwise true
   */
  public validate(savedData: ImageToolData): boolean {
    return !!savedData.file.url;
  }

  /**
   * Return Block data
   */
  public save(): ImageToolData {
    const caption = this.ui.nodes.caption;
    const linkInput = this.ui.nodes.linkInput;

    this._data.caption = caption.innerHTML;
    this._data.linkUrl = linkInput.innerHTML;

    return this.data;
  }

  /**
   * Returns configuration for block tunes: add background, add border, stretch image
   * @returns TunesMenuConfig
   */
  public renderSettings(): TunesMenuConfig {
    // Merge default tunes with the ones that might be added by user
    // @see https://github.com/editor-js/image/pull/49
    const tunes = ImageTool.tunes.concat(this.config.actions || []);
    const featureTuneMap: Record<string, string> = {
      border: 'withBorder',
      background: 'withBackground',
      caption: 'caption',
    };

    // Add caption tune to main menu if captions are enabled (default behavior)
    if (this.config.features?.caption !== false) {
      tunes.push({
        name: 'caption',
        icon: tablerIcons.textCaption,
        title: 'With caption',
        toggle: true,
      });
    }

    const availableTunes = tunes.filter((tune) => {
      const featureKey = Object.keys(featureTuneMap).find(key => featureTuneMap[key] === tune.name);

      if (featureKey === 'caption') {
        return this.config.features?.caption !== false;
      }

      return featureKey == null || this.config.features?.[featureKey as keyof FeaturesConfig] !== false;
    });

    /**
     * Check if the tune is active
     * @param tune - tune to check
     */
    const isActive = (tune: ActionConfig): boolean => {
      if (tune.name === 'caption') {
        return this.isCaptionEnabled ?? true; // Default to enabled
      }

      if (tune.name === 'linkUrl') {
        return this.isLinkEnabled ?? false; // Default to disabled
      }

      return this.data[tune.name as keyof ImageToolData] as boolean;
    };

    /**
     * Check if the size option is active
     * @param sizeName - name of the size option
     */
    const isSizeActive = (sizeName: string): boolean => {
      const size = sizeName.replace('size-', '');

      return this.data.size === size;
    };

    /**
     * Check if the alignment option is active
     * @param alignmentName - name of the alignment option
     */
    const isAlignmentActive = (alignmentName: string): boolean => {
      const alignment = alignmentName.replace('alignment-', '');

      return this.data.alignment === alignment;
    };

    // Filter out border and background from main menu (they'll be in Style submenu)
    const filteredTunes = availableTunes.filter(tune =>
      tune.name !== 'withBorder' && tune.name !== 'withBackground'
    );

    const tuneItems = filteredTunes.map(tune => ({
      icon: tune.icon,
      title: this.api.i18n.t(tune.title),
      toggle: tune.toggle,
      isActive: isActive(tune),
      hint: tune.name === 'linkUrl'
        ? {
            title: 'Link Settings',
            description: 'Make image clickable - edit URL in input field below caption',
          }
        : tune.name === 'caption'
          ? {
              title: 'Caption Display',
              description: 'Show or hide the caption text below the image',
            }
          : undefined,
      onActivate: () => {
        /** If it'a user defined tune, execute it's callback stored in action property */
        if (typeof tune.action === 'function') {
          tune.action(tune.name);

          return;
        }
        let newState = !isActive(tune);

        /**
         * For the caption tune, we can't rely on the this._data
         * because it can be manualy toggled by user
         */
        if (tune.name === 'caption') {
          this.isCaptionEnabled = !(this.isCaptionEnabled ?? false);
          newState = this.isCaptionEnabled;
        }

        /**
         * For the linkUrl tune, we can't rely on the this._data
         * because it can be manualy toggled by user
         */
        if (tune.name === 'linkUrl') {
          this.isLinkEnabled = !(this.isLinkEnabled ?? false);
          newState = this.isLinkEnabled;
        }

        this.tuneToggled(tune.name as keyof ImageToolData, newState);
      },
    }));

    // Create size menu item with children
    const sizeMenuItem = {
      icon: tablerIcons.resize,
      title: 'Size',
      children: {
        items: [
          {
            icon: tablerIcons.boxSmall,
            title: 'Small',
            toggle: 'size-group',
            isActive: isSizeActive('size-small'),
            onActivate: () => {
              this._data.size = 'small';
              this.ui.applySize('small');
            },
          },
          {
            icon: tablerIcons.boxMedium,
            title: 'Medium',
            toggle: 'size-group',
            isActive: isSizeActive('size-medium'),
            onActivate: () => {
              this._data.size = 'medium';
              this.ui.applySize('medium');
            },
          },
          {
            icon: tablerIcons.boxFull,
            title: 'Full width',
            toggle: 'size-group',
            isActive: isSizeActive('size-full'),
            onActivate: () => {
              this._data.size = 'full';
              this.ui.applySize('full');
            },
          },
        ],
      },
    };

    // Create alignment menu item with children
    const alignmentMenuItem = {
      icon: tablerIcons.alignCenter,
      title: 'Alignment',
      children: {
        items: [
          {
            icon: tablerIcons.alignLeft,
            title: 'Left',
            toggle: 'alignment-group',
            isActive: isAlignmentActive('alignment-left'),
            onActivate: () => {
              this._data.alignment = 'left';
              this.ui.applyAlignment('left');
            },
          },
          {
            icon: tablerIcons.alignCenter,
            title: 'Center',
            toggle: 'alignment-group',
            isActive: isAlignmentActive('alignment-center'),
            onActivate: () => {
              this._data.alignment = 'center';
              this.ui.applyAlignment('center');
            },
          },
          {
            icon: tablerIcons.alignRight,
            title: 'Right',
            toggle: 'alignment-group',
            isActive: isAlignmentActive('alignment-right'),
            onActivate: () => {
              this._data.alignment = 'right';
              this.ui.applyAlignment('right');
            },
          },
        ],
      },
    };

    // Create style submenu for border and background
    const styleMenuItem = {
      icon: tablerIcons.palette,
      title: 'Style',
      children: {
        items: [
          {
            icon: tablerIcons.border,
            title: 'Border',
            toggle: true,
            isActive: isActive({ name: 'withBorder' } as ActionConfig),
            hint: {
              title: 'Border Style',
              description: 'Add a decorative border around the image',
            },
            onActivate: () => {
              const newState = !isActive({ name: 'withBorder' } as ActionConfig);

              this.tuneToggled('withBorder', newState);
            },
          },
          {
            icon: tablerIcons.palette,
            title: 'Background',
            toggle: true,
            isActive: isActive({ name: 'withBackground' } as ActionConfig),
            hint: {
              title: 'Background Style',
              description: 'Add a colored background behind the image',
            },
            onActivate: () => {
              const newState = !isActive({ name: 'withBackground' } as ActionConfig);

              this.tuneToggled('withBackground', newState);
            },
          },
        ],
      },
    };

    // Add separator and size/alignment/style menu items
    return [
      ...tuneItems,
      { type: 'separator' },
      sizeMenuItem,
      alignmentMenuItem,
      styleMenuItem,
    ];
  }

  /**
   * Fires after clicks on the Toolbox Image Icon
   * Initiates click on the Select File button
   */
  public appendCallback(): void {
    this.ui.nodes.fileButton.click();
  }

  /**
   * Specify paste substitutes
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   */
  public static get pasteConfig(): PasteConfig {
    return {
      /**
       * Paste HTML into Editor
       */
      tags: [
        {
          img: { src: true },
        },
      ],
      /**
       * Paste URL of image into the Editor
       */
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?[^\s]*)?$/i,
      },

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }

  /**
   * Specify paste handlers
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @param event - editor.js custom paste event
   *                              {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
   */
  public async onPaste(event: PasteEvent): Promise<void> {
    switch (event.type) {
      case 'tag': {
        const image = (event.detail as HTMLPasteEventDetailExtended).data;

        /** Images from PDF */
        if (/^blob:/.test(image.src)) {
          const response = await fetch(image.src);

          const file = await response.blob();

          this.uploadFile(file);
          break;
        }

        this.uploadUrl(image.src);
        break;
      }
      case 'pattern': {
        const url = (event.detail as PatternPasteEventDetail).data;

        this.uploadUrl(url);
        break;
      }
      case 'file': {
        const file = (event.detail as FilePasteEventDetail).file;

        this.uploadFile(file);
        break;
      }
    }
  }

  /**
   * Private methods
   * ̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿
   */

  /**
   * Stores all Tool's data
   * @param data - data in Image Tool format
   */
  private set data(data: ImageToolData) {
    this.image = data.file;

    this._data.caption = data.caption || '';
    this._data.linkUrl = data.linkUrl || '';
    this._data.size = data.size || 'full';
    this._data.alignment = data.alignment || 'center';

    this.ui.fillCaption(this._data.caption);
    this.ui.fillLink(this._data.linkUrl);

    // Apply size and alignment classes
    this.ui.applySize(this._data.size);
    this.ui.applyAlignment(this._data.alignment);

    ImageTool.tunes.forEach(({ name: tune }) => {
      // Skip linkUrl as it's not a boolean tune - it's handled separately
      if (tune === 'linkUrl') {
        return;
      }

      const value = typeof data[tune as keyof ImageToolData] !== 'undefined' ? data[tune as keyof ImageToolData] === true || data[tune as keyof ImageToolData] === 'true' : false;

      this.setTune(tune as keyof ImageToolData, value);
    });

    if (data.linkUrl) {
      this.ui.toggleLinkInput(true);
    }
  }

  /**
   * Return Tool data
   */
  private get data(): ImageToolData {
    return this._data;
  }

  /**
   * Set new image file
   * @param file - uploaded file data
   */
  private set image(file: ImageSetterParam | undefined) {
    this._data.file = file || { url: '' };

    if (file && file.url) {
      this.ui.fillImage(file.url);
    }
  }

  /**
   * File uploading callback
   * @param response - uploading server response
   */
  private onUpload(response: UploadResponseFormat): void {
    if (response.success && Boolean(response.file)) {
      this.image = response.file;
    } else {
      this.uploadingFailed('incorrect response: ' + JSON.stringify(response));
    }
  }

  /**
   * Handle uploader errors
   * @param errorText - uploading error info
   */
  private uploadingFailed(errorText: string): void {
    console.log('Image Tool: uploading failed because of', errorText);

    this.api.notifier.show({
      message: this.api.i18n.t('Couldn’t upload image. Please try another.'),
      style: 'error',
    });
    this.ui.hidePreloader();
  }

  /**
   * Callback fired when Block Tune is activated
   * @param tuneName - tune that has been clicked
   * @param state - new state
   */
  private tuneToggled(tuneName: keyof ImageToolData, state: boolean): void {
    if (tuneName === 'caption') {
      this.isCaptionEnabled = state;
      // Don't call applyTune for caption as it doesn't need CSS classes
      this.ui.toggleCaptionInput(state); // Toggle caption input visibility

      if (state == false) {
        this._data.caption = '';
        this.ui.fillCaption('');
      }

      // Close menu and autofocus if enabling (menu closes automatically via EditorJS)
    } else if (tuneName === 'linkUrl') {
      this.isLinkEnabled = state;
      this.ui.applyTune('link', state);
      this.ui.toggleLinkInput(state); // Toggle link input visibility

      if (state == false) {
        this._data.linkUrl = '';
        this.ui.fillLink('');
      }

      // Close menu and autofocus if enabling (menu closes automatically via EditorJS)
    } else {
      /**
       * Inverse tune state
       */
      this.setTune(tuneName, state);
    }
  }

  /**
   * Set one tune
   * @param tuneName - {@link Tunes.tunes}
   * @param value - tune state
   */
  private setTune(tuneName: keyof ImageToolData, value: boolean): void {
    (this._data[tuneName] as boolean) = value;

    this.ui.applyTune(tuneName, value);
  }

  /**
   * Show preloader and upload image file
   * @param file - file that is currently uploading (from paste)
   */
  private uploadFile(file: Blob): void {
    this.uploader.uploadByFile(file, {
      onPreview: (src: string) => {
        this.ui.showPreloader(src);
      },
    });
  }

  /**
   * Show preloader and upload image by target url
   * @param url - url pasted
   */
  private uploadUrl(url: string): void {
    this.ui.showPreloader(url);
    this.uploader.uploadByUrl(url);
  }
}
