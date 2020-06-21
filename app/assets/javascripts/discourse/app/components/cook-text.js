import { next } from "@ember/runloop";
import Component from "@ember/component";
import { cookAsync } from "discourse/lib/text";
import { ajax } from "discourse/lib/ajax";

const CookText = Component.extend({
  tagName: "",
  cooked: null,

  didReceiveAttrs() {
    this._super(...arguments);
    cookAsync(this.rawText).then(cooked => {
      this.set("cooked", cooked);
      // no choice but to defer this cause
      // pretty text may only be loaded now
      next(() => {
        if (this.element && !this.isDestroying && !this.isDestroyed) {
          return window
            .requireModule("pretty-text/upload-short-url")
            .resolveAllShortUrls(ajax, this.siteSettings, this.element);
        }
      });
    });
  }
});

CookText.reopenClass({ positionalParams: ["rawText"] });

export default CookText;
