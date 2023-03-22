$(function(){
    let currentVal = "";
    let srcInpt = "idPwdInpt"; // id of the input
    let hiddenTxt = "idPwd"; // id of the input hidden where we store the password
    var inptVal, cursorStart, cursorEnd, txtRangeStart, txtRangeEnd, keyPos, txtLength, txtLength2, txtBefore, txtAfter, txtSelection, txtSelectionStart, txtSelectionEnd, selectedText;
    
    function validTxt(a) {
        // validate if the pressed key is printable or non-printable
        var valid =
            (a > 47 && a < 58) || // number keys
            // a == 32 ||
            // a == 13 || // spacebar 32 & return 13 key(s) (if you want to allow carriage returns)
            (a > 64 && a < 91) || // letter keys
            (a > 95 && a < 112) || // numpad keys
            (a > 185 && a < 193) || // ;=,-./` (in order)
            (a > 218 && a < 223); // [\]' (in order)
    
        return valid;
    }
    
    $("#" + srcInpt).on("keydown", function(e) {
        // console.log(e.keyCode);
        if ((e.ctrlKey && e.keyCode == 90) || (e.ctrlKey && e.keyCode == 65) || (e.keyCode == 32)) {
            // console.log("Z is pressed : "+e.key);
            event.preventDefault();
            return false;
        } else if (!e.ctrlKey) {
            initVal();
            // if (txtLength) {
            if (validTxt(e.keyCode)) {
                txtProcessing(e.key, "keyup");
            }
            // } else {
            //     resetVal();
            // }
            if (e.keyCode == 8) {
                //when backspace is pressed at the end
                txtProcessing("", "backspace");
            } else
            if (e.keyCode == 46) {
                //when delete is pressed
                txtProcessing("", "delete");
            }
        }
    
    });
    
    $("#" + srcInpt).on("paste", function(e) {
        // console.log("copy is triggered");
        initVal();
        e.originalEvent.clipboardData.items[0].getAsString(function(text) {
            txtProcessing(text, "pasted");
        });
    });
    
    var resetVal = function() {
        currentVal = "";
        inptVal.value = "";
    };
    
    var txtProcessing = function(txt, action) {
        // console.log(cursorStart, cursorEnd);
        if (action != "keyup") {
            if (cursorStart !== cursorEnd) {
                // applicable only for backspace and delete
                txtBefore = currentVal.substring(0, cursorStart); //text Before
                txtAfter = currentVal.substring(cursorEnd, $("#" + srcInpt).val().length); //text After
                // console.log("txtBefore :" + txtBefore + ",Txt : " + txt + ", txtAfter :" + txtAfter + ", current :" + currentVal);
                currentVal = txtBefore + txt + txtAfter;
                // console.log(currentVal);
            } else {
                if (action == "delete") {
                    taileredTxt(cursorStart + 1, txt, cursorStart);
                } else if (action == "backspace") {
                    taileredTxt(cursorStart, txt, cursorStart - 1);
                } else if (action == "pasted") {
                    taileredTxt(cursorEnd, txt, cursorStart);
                    cursorEnd = $(inptVal).get(0).value.length;
                    cursorStart = cursorEnd;
                }
                txtSelection = false;
            }
            finalizedTxt();
        } else {
            setTimeout(function() {
                initVal();
                if(txtSelection){
                    txtBefore = currentVal.substring(0, txtSelectionStart); //text Before
                    txtAfter = currentVal.substring(txtSelectionEnd, txtLength2); //text After
                    currentVal = txtBefore + txt + txtAfter;
                    // console.log(currentVal);
                }
                else {
                    taileredTxt(cursorEnd - 1, txt, cursorStart - 1);
                    // console.log("text");
                }
    
                finalizedTxt();
            }, 100);
    
        }
    
    
    };
    
    var initVal = function() {
        inptVal = document.getElementById(srcInpt);
        cursorStart = $(inptVal).get(0).selectionStart;
        cursorEnd = $(inptVal).get(0).selectionEnd;
        keyPos = inptVal.selectionStart;
        txtLength = inptVal.value.length;
    };
    
    var finalizedTxt = function() {
        document.getElementById(hiddenTxt).value = currentVal;
        var rval = $(inptVal).get(0).value.replace(/[^]/g, "•");
        if (rval != $(inptVal).get(0).value) { $(inptVal).get(0).value = rval };
        $(inptVal).get(0).selectionEnd = cursorEnd;
        txtSelection = false;
    }
    
    document.getElementById(srcInpt).addEventListener("select", function() {
        selectedText = currentVal.substring(this.selectionStart, this.selectionEnd);
        // console.log(selectedText);
        txtSelection = true;
        initVal();
        txtSelectionStart = cursorStart;
        txtSelectionEnd = cursorEnd;
        txtLength2 = $("#" + srcInpt).val().length;
        // console.log(txtSelectionStart, txtSelectionEnd);
    });
    
    var taileredTxt = function(a, b, c) {
        txtBefore = currentVal.substring(0, c); //text Before
        txtAfter = currentVal.substring(a, $("#" + srcInpt).val().length); //text After
        // console.log("txtBefore :" + txtBefore + ",Txt : " + b + ", txtAfter :" + txtAfter);
        currentVal = txtBefore + b + txtAfter;
        return currentVal;
    }   
      
});