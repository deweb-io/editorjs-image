// Tabler icons as SVG strings
export const tablerIcons = {
  photo: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 2 5 5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="m14.5 12.5-3-3a2 2 0 0 0-3 0l-2 2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L8 19"/></svg>',
  message: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  palette: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  border: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/><path d="M4 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>',
  resize: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  alignLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12H3"/><path d="M17 18H3"/><path d="M21 6H3"/></svg>',
  alignCenter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h8"/><path d="M6 18h12"/><path d="M3 6h18"/></svg>',
  alignRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12H9"/><path d="M21 18H7"/><path d="M21 6H3"/></svg>',
  boxSmall: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9h6v6H9z"/></svg>',
  boxMedium: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h12v12H6z"/></svg>',
  boxFull: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M8 8 3 3m18 0-5 5m0 8 5 5M3 21l5-5"/></svg>',
  textCaption: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15h16" /><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 20h12" /></svg>',
};

/**
 * Autofocus delay in milliseconds
 */
const autofocusDelay = 100;

import { make } from './utils/dom';
import type { API } from '@editorjs/editorjs';
import type { ImageConfig } from './types/types';

/**
 * Enumeration representing the different states of the UI.
 */
export enum UiState {
  /**
   * The UI is in an empty state, with no image loaded or being selected.
   */
  Empty = 'empty',

  /**
   * The UI is in an uploading state, indicating an image is currently being uploaded.
   */
  Uploading = 'uploading',

  /**
   * The UI is in a filled state, with an image successfully loaded.
   */
  Filled = 'filled'
};

/**
 * Nodes interface representing various elements in the UI.
 */
interface Nodes {
  /**
   * Wrapper element in the UI.
   */
  wrapper: HTMLElement;

  /**
   * Container for the image element in the UI.
   */
  imageContainer: HTMLElement;

  /**
   * Button for selecting files.
   */
  fileButton: HTMLElement;

  /**
   * Represents the image element in the UI, if one is present; otherwise, it's undefined.
   */
  imageEl?: HTMLElement;

  /**
   * Preloader element for the image.
   */
  imagePreloader: HTMLElement;

  /**
   * Caption element for the image.
   */
  caption: HTMLElement;

  /**
   * Link input for making image clickable.
   */
  linkInput: HTMLElement;

  /**
   * Container for text inputs below image.
   */
  textInputsContainer: HTMLElement;
}

/**
 * ConstructorParams interface representing parameters for the Ui class constructor.
 */
interface ConstructorParams {
  /**
   * Editor.js API.
   */
  api: API;
  /**
   * Configuration for the image.
   */
  config: ImageConfig;
  /**
   * Callback function for selecting a file.
   */
  onSelectFile: () => void;
  /**
   * Flag indicating if the UI is in read-only mode.
   */
  readOnly: boolean;
}

/**
 * Class for working with UI:
 *  - rendering base structure
 *  - show/hide preview
 *  - apply tune view
 */
export default class Ui {
  /**
   * Nodes representing various elements in the UI.
   */
  public nodes: Nodes;

  /**
   * API instance for Editor.js.
   */
  private api: API;

  /**
   * Configuration for the image tool.
   */
  private config: ImageConfig;

  /**
   * Callback function for selecting a file.
   */
  private onSelectFile: () => void;

  /**
   * Flag indicating if the UI is in read-only mode.
   */
  private readOnly: boolean;

  /**
   * @param ui - image tool Ui module
   * @param ui.api - Editor.js API
   * @param ui.config - user config
   * @param ui.onSelectFile - callback for clicks on Select file button
   * @param ui.readOnly - read-only mode flag
   */
  constructor({ api, config, onSelectFile, readOnly }: ConstructorParams) {
    this.api = api;
    this.config = config;
    this.onSelectFile = onSelectFile;
    this.readOnly = readOnly;

    // Create simplified caption input (visible by default)
    const captionInput = make('div', [this.CSS.input, this.CSS.caption], {
      contentEditable: !this.readOnly,
    });

    // Create simplified link input (visible by default)
    const linkInput = make('div', [this.CSS.input, this.CSS.linkInput], {
      contentEditable: !this.readOnly,
    });

    this.nodes = {
      wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
      imageContainer: make('div', [this.CSS.imageContainer]),
      fileButton: this.createFileButton(),
      imageEl: undefined,
      imagePreloader: make('div', this.CSS.imagePreloader),
      textInputsContainer: make('div', [this.CSS.textInputsContainer]),
      caption: captionInput,
      linkInput: linkInput,
    };

    this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder;
    // Add icon as ::before content via CSS
    this.nodes.caption.style.setProperty('--input-icon', `url('data:image/svg+xml;utf8,${encodeURIComponent(tablerIcons.textCaption)}')`);

    this.nodes.linkInput.dataset.placeholder = 'Enter a link URL...';

    this.nodes.imageContainer.appendChild(this.nodes.imagePreloader);
    this.nodes.textInputsContainer.appendChild(this.nodes.caption);
    this.nodes.textInputsContainer.appendChild(this.nodes.linkInput);

    this.nodes.wrapper.appendChild(this.nodes.imageContainer);
    this.nodes.wrapper.appendChild(this.nodes.textInputsContainer);
    this.nodes.wrapper.appendChild(this.nodes.fileButton);
  }

  /**
   * Apply visual representation of activated tune
   * @param tuneName - one of available tunes {@link Tunes.tunes}
   * @param status - true for enable, false for disable
   */
  public applyTune(tuneName: string, status: boolean): void {
    this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${tuneName}`, status);
  }

  /**
   * Apply size class to the wrapper, removing any existing size classes
   * @param size - size option (small, medium, full)
   */
  public applySize(size: string): void {
    // Remove any existing size classes
    this.nodes.wrapper.classList.remove(
      `${this.CSS.wrapper}--size-small`,
      `${this.CSS.wrapper}--size-medium`,
      `${this.CSS.wrapper}--size-full`
    );

    // Apply the new size class
    this.nodes.wrapper.classList.add(`${this.CSS.wrapper}--size-${size}`);
  }

  /**
   * Apply alignment class to the wrapper, removing any existing alignment classes
   * @param alignment - alignment option (left, center, right)
   */
  public applyAlignment(alignment: string): void {
    // Remove any existing alignment classes
    this.nodes.wrapper.classList.remove(
      `${this.CSS.wrapper}--alignment-left`,
      `${this.CSS.wrapper}--alignment-center`,
      `${this.CSS.wrapper}--alignment-right`
    );

    // Apply the new alignment class
    this.nodes.wrapper.classList.add(`${this.CSS.wrapper}--alignment-${alignment}`);
  }

  /**
   * Renders tool UI
   */
  public render(): HTMLElement {
    this.toggleStatus(UiState.Empty);

    return this.nodes.wrapper;
  }

  /**
   * Shows uploading preloader
   * @param src - preview source
   */
  public showPreloader(src: string): void {
    this.nodes.imagePreloader.style.backgroundImage = `url(${src})`;

    this.toggleStatus(UiState.Uploading);
  }

  /**
   * Hide uploading preloader
   */
  public hidePreloader(): void {
    this.nodes.imagePreloader.style.backgroundImage = '';
    this.toggleStatus(UiState.Empty);
  }

  /**
   * Shows an image
   * @param url - image source
   */
  public fillImage(url: string): void {
    /**
     * Check for a source extension to compose element correctly: video tag for mp4, img — for others
     */
    const tag = /\.mp4$/.test(url) ? 'VIDEO' : 'IMG';

    const attributes: { [key: string]: string | boolean } = {
      src: url,
    };

    /**
     * We use eventName variable because IMG and VIDEO tags have different event to be called on source load
     * - IMG: load
     * - VIDEO: loadeddata
     */
    let eventName = 'load';

    /**
     * Update attributes and eventName if source is a mp4 video
     */
    if (tag === 'VIDEO') {
      /**
       * Add attributes for playing muted mp4 as a gif
       */
      attributes.autoplay = true;
      attributes.loop = true;
      attributes.muted = true;
      attributes.playsinline = true;

      /**
       * Change event to be listened
       */
      eventName = 'loadeddata';
    }

    /**
     * Compose tag with defined attributes
     */
    this.nodes.imageEl = make(tag, this.CSS.imageEl, attributes);

    /**
     * Add load event listener
     */
    this.nodes.imageEl.addEventListener(eventName, () => {
      this.toggleStatus(UiState.Filled);

      /**
       * Preloader does not exists on first rendering with presaved data
       */
      if (this.nodes.imagePreloader !== undefined) {
        this.nodes.imagePreloader.style.backgroundImage = '';
      }
    });

    this.nodes.imageContainer.appendChild(this.nodes.imageEl);
  }

  /**
   * Shows caption input
   * @param text - caption content text
   */
  public fillCaption(text: string): void {
    if (this.nodes.caption !== undefined) {
      this.nodes.caption.innerHTML = text;
    }
  }

  /**
   * Shows link input
   * @param linkUrl - link URL content
   */
  public fillLink(linkUrl: string): void {
    if (this.nodes.linkInput !== undefined) {
      this.nodes.linkInput.innerHTML = linkUrl;
    }
  }

  /**
   * Toggles link input visibility using CSS classes
   * @param show - whether to show or hide the link input
   */
  public toggleLinkInput(show: boolean): void {
    // Apply the link tune which will show/hide via CSS
    this.applyTune('link', show);

    if (show && this.nodes.linkInput !== undefined) {
      // Add autofocus when showing the input
      setTimeout(() => this.nodes.linkInput?.focus(), autofocusDelay);
    }
  }

  /**
   * Toggles caption input visibility using CSS classes
   * @param show - whether to show or hide the caption input
   */
  public toggleCaptionInput(show: boolean): void {
    // Use CSS class to control visibility
    this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--caption-hidden`, !show);

    if (show && this.nodes.caption !== undefined) {
      // Add autofocus when showing the input
      setTimeout(() => this.nodes.caption?.focus(), autofocusDelay);
    }
  }

  /**
   * Changes UI status
   * @param status - see {@link Ui.status} constants
   */
  public toggleStatus(status: UiState): void {
    for (const statusType in UiState) {
      if (Object.prototype.hasOwnProperty.call(UiState, statusType)) {
        const state = UiState[statusType as keyof typeof UiState];

        this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${state}`, state === status);
      }
    }
  }

  /**
   * CSS classes
   */
  private get CSS(): Record<string, string> {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: 'image-tool',
      imageContainer: 'image-tool__image',
      imagePreloader: 'image-tool__image-preloader',
      imageEl: 'image-tool__image-picture',
      textInputsContainer: 'image-tool__text-inputs',
      caption: 'image-tool__caption',
      linkInput: 'image-tool__link',
    };
  };

  /**
   * Creates upload-file button
   */
  private createFileButton(): HTMLElement {
    const button = make('div', [this.CSS.button]);

    button.innerHTML = this.config.buttonContent ?? `${tablerIcons.photo} ${this.api.i18n.t('Select an Image')}`;

    button.addEventListener('click', () => {
      this.onSelectFile();
    });

    return button;
  }
}
