/********************************************************************************
/   ThreeStateSelect v1.0
/   Copyright © 2014 David J Kammer
/
/   developed using jquery 1.10.2, not test against other version
/   
/   License:
/   Creative Commons Attribution-ShareAlike 4.0 International Public License
/   http://creativecommons.org/licenses/by-sa/4.0/legalcode
/   
/    USE:
/     $(window).load(function(){ $(".threeStateSelect").makeThreeStateSelect({});});
/
/      div's should lok like this:
/      <div class="threeStateSelect" data-input-name="q1">ChestPain</div>
/      
/      data-input-name becomes the name of ahidden text input that 
/      can bu used to submit in a form.  the values of the hidden text are
/      set by the $.threeStateSelect.defaults.leftReturnValue|centerReturnValue|rightReturnValue
/      or the same fields in options if you choose to use them
/
/      the text of the div becomes the center text of the threeStateSelect
/
/      modify css file to modify colors
********************************************************************************/

(function ($) {
    "use strict";

    /**
     * buildoutThreeStateDivs - transforms the divs passed
     *
     * @param jQuery $threeStateDivs containing the built out top level divs.
     */
    function buildoutThreeStateDivs(options, $threeStateDivs) {

        var newHtml = '<span class="threeStateSelect_left" data-return-value="' + options.leftReturnValue + '">' + options.leftCharacter + '</span>' +
            '<span class="threeStateSelect_center" data-return-value="' + options.centerReturnValue + '">' +
            '<span class="threeStateSelect_centerLeftClickCatcher"></span><span class="threeStateSelect_centerRightClickCatcher"></span></span>' +
            '<span class="threeStateSelect_right" data-return-value="' + options.rightReturnValue + '">' + options.rightCharacter + '</span>' +
            '<input type="text" class="threeStateSelect_textField"/>';

        $(newHtml).appendTo($threeStateDivs);

        //Set the text inputs name
        $threeStateDivs.each(function (index, element) {
            var $this = $(element);
            if (!$this.attr("data-input-name")) {
                throw ("data-input-name is missing form one of the divs you are trying to make into a threeStateSelect");
            }
            $this.children(".threeStateSelect_textField").attr("name", $this.attr("data-input-name"));
        });

    }

    /**
     * enableClickHandlers - used to set up the click handlers
     *
     * @param jQuery $threeStateDivs containing the built out top level divs.
     */
    function enableClickHandlers(options, $threeStateDivs) {

        // Create the event handlers
        $threeStateDivs.children(".threeStateSelect_left").click(function () {
            var $this = $(this);
            if (!$this.hasClass("threeStateSelect_leftSelected")) {
                $this.parent().setThreeStateSelect("selectLeft");
            } else {
                $this.parent().setThreeStateSelect("selectOff");
            }
        });

        $threeStateDivs.children(".threeStateSelect_right").click(function () {
            var $this = $(this);
            if (!$this.hasClass("threeStateSelect_rightSelected")) {
                $this.parent().setThreeStateSelect("selectRight");
            } else {
                $this.parent().setThreeStateSelect("selectOff");
            }
        });

        $threeStateDivs.children(".threeStateSelect_center").children(".threeStateSelect_centerRightClickCatcher").click(function () {
            var $this = $(this);
            if (!($this.parent().parent().hasClass("threeStateSelect_centerReflectSelectedRight") ||
                $this.parent().parent().hasClass("threeStateSelect_centerReflectSelectedLeft"))) {
                $this.parent().parent().setThreeStateSelect("selectRight");
            } else {
                $this.parent().parent().setThreeStateSelect("selectOff");
            }
        });

        $threeStateDivs.children(".threeStateSelect_center").children(".threeStateSelect_centerLeftClickCatcher").click(function () {
            var $this = $(this);
            if (!($this.parent().parent().hasClass("threeStateSelect_centerReflectSelectedRight") ||
                $this.parent().parent().hasClass("threeStateSelect_centerReflectSelectedLeft"))) {
                $this.parent().parent().setThreeStateSelect("selectLeft");
            } else {
                $this.parent().parent().setThreeStateSelect("selectOff");
            }
        });
    }

    // Plugin defaults – added as a property on our plugin function.
    $.threeStateSelect = {
        defaults: {
            leftCharacter: "&#x2713;",
            rightCharacter: "&#10007;",
            leftReturnValue: "yes",
            centerReturnValue: "",
            rightReturnValue: "no"
        }
    };

    /**
     * $.fn.setThreeStateSelect - the click handler callback
     *     called on the toplevel div
     * @param string action
     */
    $.fn.setThreeStateSelect = function (action) {

        var $leftSpan = this.children(".threeStateSelect_left");
        var $rightSpan = this.children(".threeStateSelect_right");
        var $centerSpan = this;
        var $hiddenTextField = this.children(".threeStateSelect_textField");

        switch (action) {
        case "selectLeft":
            $leftSpan.removeClass("threeStateSelect_leftNotSelected");
            $leftSpan.addClass("threeStateSelect_leftSelected");
            $rightSpan.removeClass("threeStateSelect_rightSelected");
            $rightSpan.addClass("threeStateSelect_rightNotSelected");
            $centerSpan.addClass("threeStateSelect_centerReflectSelectedLeft");
            $centerSpan.removeClass("threeStateSelect_centerReflectSelectedRight");
            $hiddenTextField.val($leftSpan.attr("data-return-value"));
            break;
        case "selectRight":
            $rightSpan.removeClass("threeStateSelect_rightNotSelected");
            $rightSpan.addClass("threeStateSelect_rightSelected");
            $leftSpan.removeClass("threeStateSelect_leftSelected");
            $leftSpan.addClass("threeStateSelect_leftNotSelected");
            $centerSpan.addClass("threeStateSelect_centerReflectSelectedRight");
            $centerSpan.removeClass("threeStateSelect_centerReflectSelectedLeft");
            $hiddenTextField.val($rightSpan.attr("data-return-value"));
            break;
        case "selectOff":
            $leftSpan.removeClass("threeStateSelect_leftSelected threeStateSelect_leftNotSelected");
            $rightSpan.removeClass("threeStateSelect_rightSelected threeStateSelect_rightNotSelected");
            $centerSpan.removeClass("threeStateSelect_centerReflectSelectedLeft threeStateSelect_centerReflectSelectedRight");
            $hiddenTextField.val($centerSpan.attr("data-return-value"));
            break;
        default:
            throw ("$.fn.setThreeStateSelect got unknown action: " + action);
        }

        return this;
    }; 

    /**
     * $.fn.makeThreeStateSelect - called on a collection
     *      of divs and turns them into threeStateSelect
     *      objects.
     *
     *      div's should lok like this:
     *      <div class="threeStateSelect" data-input-name="q1">ChestPain</div>
     *      
     *      data-input-name becomes the name of ahidden text input that 
     *      can bu used to submit in a form.  the values of the hidden text are
     *      set by the $.threeStateSelect.defaults.leftReturnValue|centerReturnValue|rightReturnValue
     *      or the same fields in options if you choose to use them
     *
     *      the text of the div becomes the center text of the threeStateSelect
     *
     * @param object options - overrides $.threeStateSelect.defaults for this call only
     */
    $.fn.makeThreeStateSelect = function (options) {
        // Extend our default options with those provided.
        // Note that the first argument to extend is an empty
        // object – this is to keep from overriding our "defaults" object.
        var opts = $.extend({}, $.threeStateSelect.defaults, options);

        buildoutThreeStateDivs(opts, this);
        enableClickHandlers(opts, this);
    };
    
//for jshint    
/*global jQuery*/
}(jQuery));

