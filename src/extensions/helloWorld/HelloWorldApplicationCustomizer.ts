import styles from './AppCustomizer.module.scss';

import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';


export interface IHelloWorldApplicationCustomizerProperties {
  Top:string;
  Bottom:string;
}

export default class HelloWorldApplicationCustomizer
  extends BaseApplicationCustomizer<IHelloWorldApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  public onInit(): Promise<void> {

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    
    return Promise.resolve();
  }
  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );
  
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
  
      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }
  
      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }
  
        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
          <div id="topPlaceholder" class="${styles.app}">
            <div class="${styles.top}">
              Bookslist app
            </div>
          </div>`;
        }
      }
    }
  
    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );
  
      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }
  
      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }
  
        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
          <div id="bottomPlaceholder" class="${styles.app}">
            <div class="${styles.bottom}"></div>
          </div>`;
        }
      }
    }

    setTimeout(()=>{
        
      document.getElementById("SuiteNavWrapper").style.display='none';
      document.getElementById("sp-appBar").style.display='none';
      document.getElementById("spSiteHeader").style.display='none';
      document.getElementById("spCommandBar").style.display='none';
      document.getElementById("CommentsWrapper").style.display='none';
      document.getElementsByTagName("footer")[0].style.display='none';
      
    },1000)

  }
}
