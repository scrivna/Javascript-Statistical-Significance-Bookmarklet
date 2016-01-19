/*
  _____                  _____           _                           
 |  __ \                / ____|         (_)                          
 | |__) |___  ___ ___  | (___   ___ _ __ ___   _____ _ __   ___ _ __ 
 |  _  // _ \/ __/ __|  \___ \ / __| '__| \ \ / / _ \ '_ \ / _ \ '__|
 | | \ \ (_) \__ \__ \  ____) | (__| |  | |\ V /  __/ | | |  __/ |   
 |_|  \_\___/|___/___/ |_____/ \___|_|  |_| \_/ \___|_| |_|\___|_|   
                                                                     

http://rossscrivener.co.uk

I store this in dropbox then embed it with a bookmarklet.

javascript:(function(){var f=document.createElement('script');if(f){f.setAttribute("src","https://www.dropbox.com/s/vp6zo39n271ddjr/stat-sig.js?t="+(new Date).getTime()+"&dl=1");document.getElementsByTagName("head")[0].appendChild(f);}})()
*/
(function(){
	
	var boxSelected = 1;
	var foundNums = [];
	var isSelecting = false;
	
	function $(e){ return document.getElementById(e) }
	
	function log(m){ if (typeof console.log=='function') console.log(m) }
	
	function extractNumbers(str){
		str = str.replace(/[^0-9%.,-]/g, ' ');
		var regex = / *-?(\d|,)*\.?\d*%?/;
		return regex.exec(str);
	}
	
	function calculate(){
		var t1 = $('rsssbm_t1').value;
		var t2 = $('rsssbm_t2').value;
		var t3 = $('rsssbm_t3').value;
		var t4 = $('rsssbm_t4').value;
		
		if (t2.match(/%/)){ t2 = (t1/100)*t2.replace('%', ''); }
		if (t4.match(/%/)){ t4 = (t3/100)*t4.replace('%', ''); }
		
		$('rsssbm_t1').value = Math.round(parseFloat(t1) * 100) / 100;
		$('rsssbm_t2').value = Math.round(parseFloat(t2) * 100) / 100;
		$('rsssbm_t3').value = Math.round(parseFloat(t3) * 100) / 100;
		$('rsssbm_t4').value = Math.round(parseFloat(t4) * 100) / 100;
		
		var cs = chisquare($('rsssbm_t1').value,$('rsssbm_t2').value,$('rsssbm_t3').value,$('rsssbm_t4').value,95);
		
		$('rsssbm_resultfig').innerHTML = cs ? '<span class="yes">Yes</span> / No' : 'Yes / <span class="no">No</span>';
		
		if (cs){
			if ($('rsssbm_t2').value/$('rsssbm_t1').value > $('rsssbm_t4').value/$('rsssbm_t3').value){
				$('rsssbm_resultmsg').innerHTML = 'Control wins';
			} else {
				$('rsssbm_resultmsg').innerHTML = 'Variation wins';
			}
		} else {
			$('rsssbm_resultmsg').innerHTML = '';
		}
	}
	
	function chisquare(v1,c1,v2,c2,prob){
		if (prob!=95 || prob!=99) prob = 95;
		
		v1 = parseFloat(v1);
		c1 = parseFloat(c1);
		v2 = parseFloat(v2);
		c2 = parseFloat(c2);
		
		var e1 = v1/(v1+v2)*(c1+c2);
		var e2 = v2/(v1+v2)*(c1+c2);
		var cs = ((e1-c1)*(e1-c1))/e1 + ((e2-c2)*(e2-c2))/e2;
		
		log('Chi Square Expected: '+ e1 + ' ' + e2);
		log('Chi Square Result:'+ cs);
		
		if (prob == 95) return (cs > 3.840);
		if (prob == 99) return (cs > 6.640);
	}
	
	function onmouseover(e){
		if (e.target.id.substr(0,4)=='rsss') return;
		
		e.stopPropagation();
	   
	   foundNums = [];
	   
	   var nodes = e.target.childNodes;
		
		for(var i = 0; i < nodes.length; i++){
		    if(nodes[i].nodeType == 3 && nodes[i].nodeValue.match(/[0-9]/)) {
				var nums = extractNumbers(nodes[i].nodeValue);
				if (nums.length>0){
					foundNums.push(nums);
				}
		    }
		}
		
		if (foundNums.length > 0){
			//log(foundNums);
			e.target.className += " rsssbmhl";
			e.target.addEventListener("mouseout", onmouseout);
		   e.target.addEventListener("click", onclick);
		   
		   var value = foundNums[0][0].replace(',', '');
		   value = value.replace(' ', '');
		   value = value.replace(/[^0-9%.]/g, '');
		   
			$('rsssbm_t'+boxSelected).value = value;
		}
	}
	
	function onmouseout(e){
		if ( e.target.className.indexOf("rsssbmhl") != -1){
		 	e.target.classList.remove('rsssbmhl');
		}
		e.target.removeEventListener("click", onclick);
	}
	
	function onclick(e){
		e.stopPropagation();
		e.preventDefault();
		
		if (e.target.id.substr(0,4)=='rsss') return;
		
		onmouseout(e);
		e.target.removeEventListener("click", onclick);
		e.target.removeEventListener("mouseout", onmouseout);
		
		if (boxSelected==4){
			endSelecting();
			calculate();
			return;
		}
		boxSelected++;
		$('rsssbm_t'+boxSelected).focus();
		
	}
	
	function startSelecting(){
		if (isSelecting) return;
		
		isSelecting = true;
		
		boxSelected = 1;
		$('rsssbm_t'+boxSelected).focus();
		
		$('rsssbm_t1').value = '';
		$('rsssbm_t2').value = '';
		$('rsssbm_t3').value = '';
		$('rsssbm_t4').value = '';
		
		$('rsssbm_resultfig').innerHTML = 'Yes / No';
		$('rsssbm_resultmsg').innerHTML = '&nbsp;';
		
		document.body.addEventListener("mouseover", onmouseover);
	}
	
	function endSelecting(){
		if (!isSelecting) return;
		isSelecting = false;
		document.body.removeEventListener("mouseover", onmouseover);
	}
	
	function init(){
		
		var style = document.createElement('style')
		style.type = 'text/css'
		style.innerHTML = '.rsssbmhl { background: yellow !important; cursor: crosshair !important; } ';
		style.innerHTML+= '#rsssbm { position: fixed; right: 0; top: 0; width: 380px; background: #fff; color: #000; border: 5px solid rgb(100,100,100); border: 5px solid rgba(100,100,100,.5); z-index:9999; padding: 6px 0 10px 10px; border-radius: 5px; background-clip: padding-box; margin: 5px; font-size: 14px; } ';
		style.innerHTML+= '#rsssbm_link { font-size: 90%; } ';
		style.innerHTML+= '#rsssbm input[type="text"]{ width: 80px; } ';
		style.innerHTML+= '#rsssbm td { padding: 4px; vertical-align: middle; text-align: left; } ';
		style.innerHTML+= '#rsssbm th { padding: 4px; font-weight: bold; text-align: left; vertical-align: middle; } ';
		style.innerHTML+= '#rsssbm_results { font-weight: bold; margin-top: 10px; } ';
		style.innerHTML+= '#rsssbm_controls { position: absolute; top: 10px; right: 10px; width: 50px; text-align: right; } ';
		style.innerHTML+= '#rsssbm_controls input[type="button"]{ font-size: 22px; display: inline-block; width: 30px; height: 30px; vertical-align: top; margin-bottom: 5px; } ';
		style.innerHTML+= '#rsssbm_resultfig { color: #ddd; } ';
		style.innerHTML+= '#rsssbm_resultfig .yes { color: green; font-weight: bold; } ';
		style.innerHTML+= '#rsssbm_resultfig .no { color: red; font-weight: bold; } ';
		style.innerHTML+= '#rsssbm_resultmsg { color: #333; } ';
		
		document.getElementsByTagName('head')[0].appendChild(style);
		
		
		var div = document.createElement('div');
	   div.setAttribute('id', 'rsssbm');
	    
	   var html = function(){/*
	    	<table cellspacing="0" border="0" cellpadding="0">
	    	<tr>
	    		<td><a href="http://rossscrivener.co.uk/" id="rsssbm_link" target="_blank">Chi-squared</a></td>
	    		<th>Control</th>
	    		<th>Variation</th>
	    	</tr>
	    	<tr>
	    		<th>Participants</th>
	    		<td><input type="text" id="rsssbm_t1" tabindex="91"></td>
	    		<td><input type="text" id="rsssbm_t3" tabindex="92"></td>
	    	</tr>
	    	<tr>
	    		<th>Conv. / Conv % &nbsp;</th>
	    		<td><input type="text" id="rsssbm_t2" tabindex="93"></td>
	    		<td><input type="text" id="rsssbm_t4" tabindex="94"></td>
	    	</tr>
	    	<tr>
	    		<th><div id="rsssbm_resultlabel">95% Significant? &nbsp;</div></th>
	    		<td><div id="rsssbm_resultfig">&nbsp;</div></td>
	    		<td><div id="rsssbm_resultmsg">&nbsp;</div></td>
	    	</tr>
	    	</table>
	    	
	    	<div id="rsssbm_controls">
		    	<input type="button" id="rsssbm_close" value="&#10005;">
		    	<input type="button" id="rsssbm_start" value="&#9998;">
		    	<input type="button" id="rsssbm_calc" value="="><br />
		   </div>
		*/}.toString().slice(14,-3)
	    div.innerHTML = html;
	    document.body.appendChild(div);
	    
	    $('rsssbm_t1').addEventListener("focus", function (e){ boxSelected = 1; });
	    $('rsssbm_t2').addEventListener("focus", function (e){ boxSelected = 2; });
	    $('rsssbm_t3').addEventListener("focus", function (e){ boxSelected = 3; });
	    $('rsssbm_t4').addEventListener("focus", function (e){ boxSelected = 4; });
	    
	    $('rsssbm_t1').addEventListener("change", function (e){ calculate(); });
	    $('rsssbm_t2').addEventListener("change", function (e){ calculate(); });
	    $('rsssbm_t3').addEventListener("change", function (e){ calculate(); });
	    $('rsssbm_t4').addEventListener("change", function (e){ calculate(); });
	    
	    $('rsssbm_close').addEventListener("click", function (e){ close(); });
	    $('rsssbm_start').addEventListener("click", function (e){ if (isSelecting){ endSelecting(); } else { endSelecting(); startSelecting(); } });
	    $('rsssbm_calc').addEventListener("click", function (e){ calculate(); });
	    
	    startSelecting();
	}
	
	function close(){
		endSelecting();
		if ($('rsssbm')) $('rsssbm').parentNode.removeChild($('rsssbm'));
	}
	
	close();
	init();
})();
