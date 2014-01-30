/**
 * User: dbreuer
 * Date: 17.01.14
 * Time: 15:56
 */

(function(win, doc){

    var sProgressBarCode = ''
            + '<div id="{{id}}-wrapper" class="dust-progress-bar-wrapper">'
                + '<div id="{{id}}-bar" class="dust-progress-bar">'
                    + '<div id="{{id}}-bar-value" class="dust-progress-bar-value"></div>'
                + '</div>'
            + '</div>';

    var oContainer = document.createElement('div');

    oContainer.innerHTML = sProgressBarCode.replace(/{{id}}/g, chrome.runtime.id);
    doc.body.appendChild(oContainer);

    var iValue = 0,
        iInterval,
        oProgressBarValueElement = doc.getElementById(chrome.runtime.id + "-bar-value");

    console.info("init");
    console.dir(oProgressBarValueElement);

    var oPort = chrome.runtime.connect(chrome.runtime.id), oNextDate = new Date(), oBaseDate = new Date();

    oPort.onMessage.addListener(function(oMessage, oSender){
        console.info("oPort.onMessage");
        console.dir(arguments);

        switch (oMessage.type){
            case "nextDate":
                oBaseDate = new Date(oMessage.base);
                oNextDate = new Date(oMessage.next);
                resetProgressBar();
                startInterval();
                break;
        }
    });

    oPort.postMessage({
        "type": "init"
    });

    function resetProgressBar(){
        console.info("resetProgressBar");
        console.dir(oProgressBarValueElement);
        oProgressBarValueElement.style.transition = "";
        oProgressBarValueElement.style.width = (Date.now() - oBaseDate.getTime()) / (oNextDate.getTime() - oBaseDate.getTime()) * 100 + "%";

        window.requestAnimationFrame(function(){
            var iFinishInMillis = (oNextDate.getTime() - Date.now())

            oProgressBarValueElement.style.transition = "width " + iFinishInMillis + "ms linear";
            oProgressBarValueElement.style.width = 100 + "%";

            window.setTimeout(function(){
                oPort.postMessage({
                    "type": "finish"
                });
            }, iFinishInMillis);
        });
    }

    function startInterval(){

//        window.requestAnimationFrame(function(){
//            iValue = (Date.now() - oBaseDate.getTime()) / (oNextDate.getTime() - oBaseDate.getTime()) * 100;
//
//            console.log(iValue);
//
//            if(iValue >= 100){
//                oPort.postMessage({
//                    "type": "finish"
//                });
//
//                oProgressBarValueElement.classList.add("done");
//                return;
//            } else {
//                oProgressBarValueElement.style.width = iValue.toString() + "%";
//                startInterval();
//            }
//        });

//        iInterval = window.setInterval(function(){
//
//            iValue = (Date.now() - oBaseDate.getTime()) / (oNextDate.getTime() - oBaseDate.getTime()) * 100;
//
//            console.log(iValue);
//
//            if(iValue >= 100){
//                oPort.postMessage({
//                    "type": "finish"
//                });
//
//                clearInterval(iInterval);
//                oProgressBarValueElement.classList.add("done");
//                return;
//            }
//
//            oProgressBarValueElement.style.width = iValue.toString() + "%";
//        }, 1000);
    }

})(window, document);