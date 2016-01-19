# Javascript Statistical Significance Browser Bookmarklet
Bookmarklet for selecting numbers from a web page and calculating if they are statistically significant (Chi-square)

I store this in dropbox then embed it with a bookmarklet.

```javascript
javascript:(function(){var f=document.createElement('script');if(f){f.setAttribute("src","https://www.dropbox.com/s/vp6zo39n271ddjr/stat-sig.js?t="+(new Date).getTime()+"&dl=1");document.getElementsByTagName("head")[0].appendChild(f);}})()
```
