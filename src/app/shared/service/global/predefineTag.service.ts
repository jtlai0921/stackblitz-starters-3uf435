/**
 * 處理 自定義html tag
 */

import { Injectable, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
@Injectable()
export class PredefineTag {

    constructor(
        private domSanitizer :DomSanitizer,
    ) {
    }

    public PredefineTag(Content){
        var div2 = document.createElement('div');
        div2.appendChild(document.createTextNode(Content));
        var content =  div2.innerHTML;
        return this.domSanitizer.bypassSecurityTrustHtml(this.replace(content));
    }

    private replace(content){
   
        //轉碼
        content = this.replaceTag(content,"strong");
        content = this.replaceTag(content,"oblique");
        content = this.replaceTag(content,"color");
        content = this.replaceTag(content,"link");
        content = this.replaceTag(content,"tel");
        content = this.replaceTag(content,"size");
        //轉碼
        content = content
        .replace(/&lt;strong/g,"<strong")
        .replace(/&lt;oblique/g,"<oblique")
        .replace(/&lt;color/g,"<color")
        .replace(/&lt;link/g,"<link")
        .replace(/&lt;tel/g,"<tel")
        .replace(/&lt;size/g,"<size")
        .replace(/&lt;\/strong&gt;/g,"</strong>")
        .replace(/&lt;\/oblique&gt;/g,"</oblique>")
        .replace(/&lt;\/color&gt;/g,"</color>")
        .replace(/&lt;\/link&gt;/g,"</link>")
        .replace(/&lt;\/tel&gt;/g,"</tel>")
        .replace(/&lt;\/size&gt;/g,"</size>")
    
        //前
        content =  content.replace(/<oblique/g, "<span style='font-style:oblique'");
        content =  content.replace(/<color:#/g, "<span style=color:#");
        content =  content.replace(/<link:/g, "<a href='");
        content =  content.replace(/\/>/g, "\/'>");
        content =  content.replace(/<tel:/g, "<a href=tel:");
        content =  content.replace(/<size:/g, "<span style=font-size:");
        //後
        content = content.replace(/<\/oblique>/g, '</span>');
        content = content.replace(/<\/color>/g, '</span>');
        content = content.replace(/<\/link>/g, '</a>')
        content = content.replace(/<\/tel>/g, '</a>');
        content = content.replace(/<\/size>/g, '</span>');
    
        return content;
      }
    
      private replaceTag(content,tag){
        var index = 0;
        var tempIndex = 0;
        //oblique
        while(index > -1){
          index = content.indexOf("&lt;"+tag,tempIndex);
          if(index > -1){
            var endIndex = content.indexOf("&gt;",index);
            content = this.spliceString(content,endIndex,4,">")
            tempIndex = index + 4 + tag.length;
          }
        }
        return content;
      }
    
      private spliceString(content, index, count, add) {
        if (index < 0) {
          index = content.length + index;
          if (index < 0) {
            index = 0;
          }
        }
        return content.slice(0, index) + (add || "") + content.slice(index + count);
      }

}
