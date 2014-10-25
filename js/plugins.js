// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*! jQuery Validation Plugin - v1.10.0 - 9/7/2012
* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2012 Jörn Zaefferer; Licensed MIT, GPL */
(function($) {
 
$.extend($.fn, {
    // http://docs.jquery.com/Plugins/Validation/validate
    validate: function( options ) {

        // if nothing is selected, return nothing; can't chain anyway
        if (!this.length) {
            if (options && options.debug && window.console) {
                console.warn( "nothing selected, can't validate, returning nothing" );
            }
            return;
        }

        // check if a validator for this form was already created
        var validator = $.data(this[0], 'validator');
        if ( validator ) {
            return validator;
        }

        // Add novalidate tag if HTML5.
        this.attr('novalidate', 'novalidate');

        validator = new $.validator( options, this[0] );
        $.data(this[0], 'validator', validator);

        if ( validator.settings.onsubmit ) {

            this.validateDelegate( ":submit", "click", function(ev) {
                if ( validator.settings.submitHandler ) {
                    validator.submitButton = ev.target;
                }
                // allow suppressing validation by adding a cancel class to the submit button
                if ( $(ev.target).hasClass('cancel') ) {
                    validator.cancelSubmit = true;
                }
            });

            // validate the form on submit
            this.submit( function( event ) {
                if ( validator.settings.debug ) {
                    // prevent form submit to be able to see console output
                    event.preventDefault();
                }
                function handle() {
                    var hidden;
                    if ( validator.settings.submitHandler ) {
                        if (validator.submitButton) {
                            // insert a hidden input as a replacement for the missing submit button
                            hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                        }
                        validator.settings.submitHandler.call( validator, validator.currentForm, event );
                        if (validator.submitButton) {
                            // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                            hidden.remove();
                        }
                        return false;
                    }
                    return true;
                }

                // prevent submit for invalid forms or custom submit handlers
                if ( validator.cancelSubmit ) {
                    validator.cancelSubmit = false;
                    return handle();
                }
                if ( validator.form() ) {
                    if ( validator.pendingRequest ) {
                        validator.formSubmitted = true;
                        return false;
                    }
                    return handle();
                } else {
                    validator.focusInvalid();
                    return false;
                }
            });
        }

        return validator;
    },
    // http://docs.jquery.com/Plugins/Validation/valid
    valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
                valid &= validator.element(this);
            });
            return valid;
        }
    },
    // attributes: space seperated list of attributes to retrieve and remove
    removeAttrs: function(attributes) {
        var result = {},
            $element = this;
        $.each(attributes.split(/\s/), function(index, value) {
            result[value] = $element.attr(value);
            $element.removeAttr(value);
        });
        return result;
    },
    // http://docs.jquery.com/Plugins/Validation/rules
    rules: function(command, argument) {
        var element = this[0];

        if (command) {
            var settings = $.data(element.form, 'validator').settings;
            var staticRules = settings.rules;
            var existingRules = $.validator.staticRules(element);
            switch(command) {
            case "add":
                $.extend(existingRules, $.validator.normalizeRule(argument));
                staticRules[element.name] = existingRules;
                if (argument.messages) {
                    settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
                }
                break;
            case "remove":
                if (!argument) {
                    delete staticRules[element.name];
                    return existingRules;
                }
                var filtered = {};
                $.each(argument.split(/\s/), function(index, method) {
                    filtered[method] = existingRules[method];
                    delete existingRules[method];
                });
                return filtered;
            }
        }

        var data = $.validator.normalizeRules(
        $.extend(
            {},
            $.validator.metadataRules(element),
            $.validator.classRules(element),
            $.validator.attributeRules(element),
            $.validator.staticRules(element)
        ), element);

        // make sure required is at front
        if (data.required) {
            var param = data.required;
            delete data.required;
            data = $.extend({required: param}, data);
        }

        return data;
    }
});

// Custom selectors
$.extend($.expr[":"], {
    // http://docs.jquery.com/Plugins/Validation/blank
    blank: function(a) {return !$.trim("" + a.value);},
    // http://docs.jquery.com/Plugins/Validation/filled
    filled: function(a) {return !!$.trim("" + a.value);},
    // http://docs.jquery.com/Plugins/Validation/unchecked
    unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
    this.settings = $.extend( true, {}, $.validator.defaults, options );
    this.currentForm = form;
    this.init();
};

$.validator.format = function(source, params) {
    if ( arguments.length === 1 ) {
        return function() {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.validator.format.apply( this, args );
        };
    }
    if ( arguments.length > 2 && params.constructor !== Array  ) {
        params = $.makeArray(arguments).slice(1);
    }
    if ( params.constructor !== Array ) {
        params = [ params ];
    }
    $.each(params, function(i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};

$.extend($.validator, {

    defaults: {
        messages: {},
        groups: {},
        rules: {},
        errorClass: "error",
        validClass: "valid",
        errorElement: "label",
        focusInvalid: true,
        errorContainer: $( [] ),
        errorLabelContainer: $( [] ),
        onsubmit: true,
        ignore: ":hidden",
        ignoreTitle: false,
        onfocusin: function(element, event) {
            this.lastActive = element;

            // hide error label and remove error class on focus if enabled
            if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
                if ( this.settings.unhighlight ) {
                    this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
                }
                this.addWrapper(this.errorsFor(element)).hide();
            }
        },
        onfocusout: function(element, event) {
            if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
                this.element(element);
            }
        },
        onkeyup: function(element, event) {
            if ( event.which === 9 && this.elementValue(element) === '' ) {
                return;
            } else if ( element.name in this.submitted || element === this.lastActive ) {
                this.element(element);
            }
        },
        onclick: function(element, event) {
            // click on selects, radiobuttons and checkboxes
            if ( element.name in this.submitted ) {
                this.element(element);
            }
            // or option elements, check parent select in that case
            else if (element.parentNode.name in this.submitted) {
                this.element(element.parentNode);
            }
        },
        highlight: function(element, errorClass, validClass) {
            if (element.type === 'radio') {
                this.findByName(element.name).addClass(errorClass).removeClass(validClass);
            } else {
                $(element).addClass(errorClass).removeClass(validClass);
            }
        },
        unhighlight: function(element, errorClass, validClass) {
            if (element.type === 'radio') {
                this.findByName(element.name).removeClass(errorClass).addClass(validClass);
            } else {
                $(element).removeClass(errorClass).addClass(validClass);
            }
        }
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
    setDefaults: function(settings) {
        $.extend( $.validator.defaults, settings );
    },

    messages: {
        required: "This field is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        maxlength: $.validator.format("Please enter no more than {0} characters."),
        minlength: $.validator.format("Please enter at least {0} characters."),
        rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
        range: $.validator.format("Please enter a value between {0} and {1}."),
        max: $.validator.format("Please enter a value less than or equal to {0}."),
        min: $.validator.format("Please enter a value greater than or equal to {0}.")
    },

    autoCreateRanges: false,

    prototype: {

        init: function() {
            this.labelContainer = $(this.settings.errorLabelContainer);
            this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
            this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
            this.submitted = {};
            this.valueCache = {};
            this.pendingRequest = 0;
            this.pending = {};
            this.invalid = {};
            this.reset();

            var groups = (this.groups = {});
            $.each(this.settings.groups, function(key, value) {
                $.each(value.split(/\s/), function(index, name) {
                    groups[name] = key;
                });
            });
            var rules = this.settings.rules;
            $.each(rules, function(key, value) {
                rules[key] = $.validator.normalizeRule(value);
            });

            function delegate(event) {
                var validator = $.data(this[0].form, "validator"),
                    eventType = "on" + event.type.replace(/^validate/, "");
                if (validator.settings[eventType]) {
                    validator.settings[eventType].call(validator, this[0], event);
                }
            }
            $(this.currentForm)
                .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                    "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                    "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], " +
                    "[type='range'], [type='color'] ",
                    "focusin focusout keyup", delegate)
                .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

            if (this.settings.invalidHandler) {
                $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            }
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/form
        form: function() {
            this.checkForm();
            $.extend(this.submitted, this.errorMap);
            this.invalid = $.extend({}, this.errorMap);
            if (!this.valid()) {
                $(this.currentForm).triggerHandler("invalid-form", [this]);
            }
            this.showErrors();
            return this.valid();
        },

        checkForm: function() {
            this.prepareForm();
            for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
                this.check( elements[i] );
            }
            return this.valid();
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/element
        element: function( element ) {
            element = this.validationTargetFor( this.clean( element ) );
            this.lastElement = element;
            this.prepareElement( element );
            this.currentElements = $(element);
            var result = this.check( element ) !== false;
            if (result) {
                delete this.invalid[element.name];
            } else {
                this.invalid[element.name] = true;
            }
            if ( !this.numberOfInvalids() ) {
                // Hide error containers on last error
                this.toHide = this.toHide.add( this.containers );
            }
            this.showErrors();
            return result;
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
        showErrors: function(errors) {
            if(errors) {
                // add items to error list and map
                $.extend( this.errorMap, errors );
                this.errorList = [];
                for ( var name in errors ) {
                    this.errorList.push({
                        message: errors[name],
                        element: this.findByName(name)[0]
                    });
                }
                // remove items from success list
                this.successList = $.grep( this.successList, function(element) {
                    return !(element.name in errors);
                });
            }
            if (this.settings.showErrors) {
                this.settings.showErrors.call( this, this.errorMap, this.errorList );
            } else {
                this.defaultShowErrors();
            }
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
        resetForm: function() {
            if ( $.fn.resetForm ) {
                $( this.currentForm ).resetForm();
            }
            this.submitted = {};
            this.lastElement = null;
            this.prepareForm();
            this.hideErrors();
            this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
        },

        numberOfInvalids: function() {
            return this.objectLength(this.invalid);
        },

        objectLength: function( obj ) {
            var count = 0;
            for ( var i in obj ) {
                count++;
            }
            return count;
        },

        hideErrors: function() {
            this.addWrapper( this.toHide ).hide();
        },

        valid: function() {
            return this.size() === 0;
        },

        size: function() {
            return this.errorList.length;
        },

        focusInvalid: function() {
            if( this.settings.focusInvalid ) {
                try {
                    $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                    .filter(":visible")
                    .focus()
                    // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                    .trigger("focusin");
                } catch(e) {
                    // ignore IE throwing errors when focusing hidden elements
                }
            }
        },

        findLastActive: function() {
            var lastActive = this.lastActive;
            return lastActive && $.grep(this.errorList, function(n) {
                return n.element.name === lastActive.name;
            }).length === 1 && lastActive;
        },

        elements: function() {
            var validator = this,
                rulesCache = {};

            // select all valid inputs inside the form (no submit or reset buttons)
            return $(this.currentForm)
            .find("input, select, textarea")
            .not(":submit, :reset, :image, [disabled]")
            .not( this.settings.ignore )
            .filter(function() {
                if ( !this.name && validator.settings.debug && window.console ) {
                    console.error( "%o has no name assigned", this);
                }

                // select only the first element for each name, and only those with rules specified
                if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
                    return false;
                }

                rulesCache[this.name] = true;
                return true;
            });
        },

        clean: function( selector ) {
            return $( selector )[0];
        },

        errors: function() {
            var errorClass = this.settings.errorClass.replace(' ', '.');
            return $( this.settings.errorElement + "." + errorClass, this.errorContext );
        },

        reset: function() {
            this.successList = [];
            this.errorList = [];
            this.errorMap = {};
            this.toShow = $([]);
            this.toHide = $([]);
            this.currentElements = $([]);
        },

        prepareForm: function() {
            this.reset();
            this.toHide = this.errors().add( this.containers );
        },

        prepareElement: function( element ) {
            this.reset();
            this.toHide = this.errorsFor(element);
        },

        elementValue: function( element ) {
            var type = $(element).attr('type'),
                val = $(element).val();

            if ( type === 'radio' || type === 'checkbox' ) {
                return $('input[name="' + $(element).attr('name') + '"]:checked').val();
            }

            if ( typeof val === 'string' ) {
                return val.replace(/\r/g, "");
            }
            return val;
        },

        check: function( element ) {
            element = this.validationTargetFor( this.clean( element ) );

            var rules = $(element).rules();
            var dependencyMismatch = false;
            var val = this.elementValue(element);
            var result;

            for (var method in rules ) {
                var rule = { method: method, parameters: rules[method] };
                try {

                    result = $.validator.methods[method].call( this, val, element, rule.parameters );

                    // if a method indicates that the field is optional and therefore valid,
                    // don't mark it as valid when there are no other rules
                    if ( result === "dependency-mismatch" ) {
                        dependencyMismatch = true;
                        continue;
                    }
                    dependencyMismatch = false;

                    if ( result === "pending" ) {
                        this.toHide = this.toHide.not( this.errorsFor(element) );
                        return;
                    }

                    if( !result ) {
                        this.formatAndAdd( element, rule );
                        return false;
                    }
                } catch(e) {
                    if ( this.settings.debug && window.console ) {
                        console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", e);
                    }
                    throw e;
                }
            }
            if (dependencyMismatch) {
                return;
            }
            if ( this.objectLength(rules) ) {
                this.successList.push(element);
            }
            return true;
        },

        // return the custom message for the given element and validation method
        // specified in the element's "messages" metadata
        customMetaMessage: function(element, method) {
            if (!$.metadata) {
                return;
            }
            var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
            return meta && meta.messages && meta.messages[method];
        },

        // return the custom message for the given element and validation method
        // specified in the element's HTML5 data attribute
        customDataMessage: function(element, method) {
            return $(element).data('msg-' + method.toLowerCase()) || (element.attributes && $(element).attr('data-msg-' + method.toLowerCase()));
        },

        // return the custom message for the given element name and validation method
        customMessage: function( name, method ) {
            var m = this.settings.messages[name];
            return m && (m.constructor === String ? m : m[method]);
        },

        // return the first defined argument, allowing empty strings
        findDefined: function() {
            for(var i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
                    return arguments[i];
                }
            }
            return undefined;
        },

        defaultMessage: function( element, method) {
            return this.findDefined(
                this.customMessage( element.name, method ),
                this.customDataMessage( element, method ),
                this.customMetaMessage( element, method ),
                // title is never undefined, so handle empty string as undefined
                !this.settings.ignoreTitle && element.title || undefined,
                $.validator.messages[method],
                "<strong>Warning: No message defined for " + element.name + "</strong>"
            );
        },

        formatAndAdd: function( element, rule ) {
            var message = this.defaultMessage( element, rule.method ),
                theregex = /\$?\{(\d+)\}/g;
            if ( typeof message === "function" ) {
                message = message.call(this, rule.parameters, element);
            } else if (theregex.test(message)) {
                message = $.validator.format(message.replace(theregex, '{$1}'), rule.parameters);
            }
            this.errorList.push({
                message: message,
                element: element
            });

            this.errorMap[element.name] = message;
            this.submitted[element.name] = message;
        },

        addWrapper: function(toToggle) {
            if ( this.settings.wrapper ) {
                toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
            }
            return toToggle;
        },

        defaultShowErrors: function() {
            var i, elements;
            for ( i = 0; this.errorList[i]; i++ ) {
                var error = this.errorList[i];
                if ( this.settings.highlight ) {
                    this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
                }
                this.showLabel( error.element, error.message );
            }
            if( this.errorList.length ) {
                this.toShow = this.toShow.add( this.containers );
            }
            if (this.settings.success) {
                for ( i = 0; this.successList[i]; i++ ) {
                    this.showLabel( this.successList[i] );
                }
            }
            if (this.settings.unhighlight) {
                for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
                    this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
                }
            }
            this.toHide = this.toHide.not( this.toShow );
            this.hideErrors();
            this.addWrapper( this.toShow ).show();
        },

        validElements: function() {
            return this.currentElements.not(this.invalidElements());
        },

        invalidElements: function() {
            return $(this.errorList).map(function() {
                return this.element;
            });
        },

        showLabel: function(element, message) {
            var label = this.errorsFor( element );
            if ( label.length ) {
                // refresh error/success class
                label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

                // check if we have a generated label, replace the message then
                if ( label.attr("generated") ) {
                    label.html(message);
                }
            } else {
                // create label
                label = $("<" + this.settings.errorElement + "/>")
                    .attr({"for":  this.idOrName(element), generated: true})
                    .addClass(this.settings.errorClass)
                    .html(message || "");
                if ( this.settings.wrapper ) {
                    // make sure the element is visible, even in IE
                    // actually showing the wrapped element is handled elsewhere
                    label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                }
                if ( !this.labelContainer.append(label).length ) {
                    if ( this.settings.errorPlacement ) {
                        this.settings.errorPlacement(label, $(element) );
                    } else {
                    label.insertAfter(element);
                    }
                }
            }
            if ( !message && this.settings.success ) {
                label.text("");
                if ( typeof this.settings.success === "string" ) {
                    label.addClass( this.settings.success );
                } else {
                    this.settings.success( label, element );
                }
            }
            this.toShow = this.toShow.add(label);
        },

        errorsFor: function(element) {
            var name = this.idOrName(element);
            return this.errors().filter(function() {
                return $(this).attr('for') === name;
            });
        },

        idOrName: function(element) {
            return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
        },

        validationTargetFor: function(element) {
            // if radio/checkbox, validate first element in group instead
            if (this.checkable(element)) {
                element = this.findByName( element.name ).not(this.settings.ignore)[0];
            }
            return element;
        },

        checkable: function( element ) {
            return (/radio|checkbox/i).test(element.type);
        },

        findByName: function( name ) {
            return $(this.currentForm).find('[name="' + name + '"]');
        },

        getLength: function(value, element) {
            switch( element.nodeName.toLowerCase() ) {
            case 'select':
                return $("option:selected", element).length;
            case 'input':
                if( this.checkable( element) ) {
                    return this.findByName(element.name).filter(':checked').length;
                }
            }
            return value.length;
        },

        depend: function(param, element) {
            return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
        },

        dependTypes: {
            "boolean": function(param, element) {
                return param;
            },
            "string": function(param, element) {
                return !!$(param, element.form).length;
            },
            "function": function(param, element) {
                return param(element);
            }
        },

        optional: function(element) {
            var val = this.elementValue(element);
            return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
        },

        startRequest: function(element) {
            if (!this.pending[element.name]) {
                this.pendingRequest++;
                this.pending[element.name] = true;
            }
        },

        stopRequest: function(element, valid) {
            this.pendingRequest--;
            // sometimes synchronization fails, make sure pendingRequest is never < 0
            if (this.pendingRequest < 0) {
                this.pendingRequest = 0;
            }
            delete this.pending[element.name];
            if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
                $(this.currentForm).submit();
                this.formSubmitted = false;
            } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                $(this.currentForm).triggerHandler("invalid-form", [this]);
                this.formSubmitted = false;
            }
        },

        previousValue: function(element) {
            return $.data(element, "previousValue") || $.data(element, "previousValue", {
                old: null,
                valid: true,
                message: this.defaultMessage( element, "remote" )
            });
        }

    },

    classRuleSettings: {
        required: {required: true},
        email: {email: true},
        url: {url: true},
        date: {date: true},
        dateISO: {dateISO: true},
        number: {number: true},
        digits: {digits: true},
        creditcard: {creditcard: true}
    },

    addClassRules: function(className, rules) {
        if ( className.constructor === String ) {
            this.classRuleSettings[className] = rules;
        } else {
            $.extend(this.classRuleSettings, className);
        }
    },

    classRules: function(element) {
        var rules = {};
        var classes = $(element).attr('class');
        if ( classes ) {
            $.each(classes.split(' '), function() {
                if (this in $.validator.classRuleSettings) {
                    $.extend(rules, $.validator.classRuleSettings[this]);
                }
            });
        }
        return rules;
    },

    attributeRules: function(element) {
        var rules = {};
        var $element = $(element);

        for (var method in $.validator.methods) {
            var value;

            // support for <input required> in both html5 and older browsers
            if (method === 'required') {
                value = $element.get(0).getAttribute(method);
                // Some browsers return an empty string for the required attribute
                // and non-HTML5 browsers might have required="" markup
                if (value === "") {
                    value = true;
                }
                // force non-HTML5 browsers to return bool
                value = !!value;
            } else {
                value = $element.attr(method);
            }

            if (value) {
                rules[method] = value;
            } else if ($element[0].getAttribute("type") === method) {
                rules[method] = true;
            }
        }

        // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
        if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
            delete rules.maxlength;
        }

        return rules;
    },

    metadataRules: function(element) {
        if (!$.metadata) {
            return {};
        }

        var meta = $.data(element.form, 'validator').settings.meta;
        return meta ?
            $(element).metadata()[meta] :
            $(element).metadata();
    },

    staticRules: function(element) {
        var rules = {};
        var validator = $.data(element.form, 'validator');
        if (validator.settings.rules) {
            rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
        }
        return rules;
    },

    normalizeRules: function(rules, element) {
        // handle dependency check
        $.each(rules, function(prop, val) {
            // ignore rule when param is explicitly false, eg. required:false
            if (val === false) {
                delete rules[prop];
                return;
            }
            if (val.param || val.depends) {
                var keepRule = true;
                switch (typeof val.depends) {
                    case "string":
                        keepRule = !!$(val.depends, element.form).length;
                        break;
                    case "function":
                        keepRule = val.depends.call(element, element);
                        break;
                }
                if (keepRule) {
                    rules[prop] = val.param !== undefined ? val.param : true;
                } else {
                    delete rules[prop];
                }
            }
        });

        // evaluate parameters
        $.each(rules, function(rule, parameter) {
            rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
        });

        // clean number parameters
        $.each(['minlength', 'maxlength', 'min', 'max'], function() {
            if (rules[this]) {
                rules[this] = Number(rules[this]);
            }
        });
        $.each(['rangelength', 'range'], function() {
            if (rules[this]) {
                rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
            }
        });

        if ($.validator.autoCreateRanges) {
            // auto-create ranges
            if (rules.min && rules.max) {
                rules.range = [rules.min, rules.max];
                delete rules.min;
                delete rules.max;
            }
            if (rules.minlength && rules.maxlength) {
                rules.rangelength = [rules.minlength, rules.maxlength];
                delete rules.minlength;
                delete rules.maxlength;
            }
        }

        // To support custom messages in metadata ignore rule methods titled "messages"
        if (rules.messages) {
            delete rules.messages;
        }

        return rules;
    },

    // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
    normalizeRule: function(data) {
        if( typeof data === "string" ) {
            var transformed = {};
            $.each(data.split(/\s/), function() {
                transformed[this] = true;
            });
            data = transformed;
        }
        return data;
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
    addMethod: function(name, method, message) {
        $.validator.methods[name] = method;
        $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
        if (method.length < 3) {
            $.validator.addClassRules(name, $.validator.normalizeRule(name));
        }
    },

    methods: {

        // http://docs.jquery.com/Plugins/Validation/Methods/required
        required: function(value, element, param) {
            // check if dependency is met
            if ( !this.depend(param, element) ) {
                return "dependency-mismatch";
            }
            if ( element.nodeName.toLowerCase() === "select" ) {
                // could be an array for select-multiple or a string, both are fine this way
                var val = $(element).val();
                return val && val.length > 0;
            }
            if ( this.checkable(element) ) {
                return this.getLength(value, element) > 0;
            }
            return $.trim(value).length > 0;
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/remote
        remote: function(value, element, param) {
            if ( this.optional(element) ) {
                return "dependency-mismatch";
            }

            var previous = this.previousValue(element);
            if (!this.settings.messages[element.name] ) {
                this.settings.messages[element.name] = {};
            }
            previous.originalMessage = this.settings.messages[element.name].remote;
            this.settings.messages[element.name].remote = previous.message;

            param = typeof param === "string" && {url:param} || param;

            if ( this.pending[element.name] ) {
                return "pending";
            }
            if ( previous.old === value ) {
                return previous.valid;
            }

            previous.old = value;
            var validator = this;
            this.startRequest(element);
            var data = {};
            data[element.name] = value;
            $.ajax($.extend(true, {
                url: param,
                mode: "abort",
                port: "validate" + element.name,
                dataType: "json",
                data: data,
                success: function(response) {
                    validator.settings.messages[element.name].remote = previous.originalMessage;
                    var valid = response === true || response === "true";
                    if ( valid ) {
                        var submitted = validator.formSubmitted;
                        validator.prepareElement(element);
                        validator.formSubmitted = submitted;
                        validator.successList.push(element);
                        delete validator.invalid[element.name];
                        validator.showErrors();
                    } else {
                        var errors = {};
                        var message = response || validator.defaultMessage( element, "remote" );
                        errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                        validator.invalid[element.name] = true;
                        validator.showErrors(errors);
                    }
                    previous.valid = valid;
                    validator.stopRequest(element, valid);
                }
            }, param));
            return "pending";
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/minlength
        minlength: function(value, element, param) {
            var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
            return this.optional(element) || length >= param;
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
        maxlength: function(value, element, param) {
            var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
            return this.optional(element) || length <= param;
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
        rangelength: function(value, element, param) {
            var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
            return this.optional(element) || ( length >= param[0] && length <= param[1] );
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/min
        min: function( value, element, param ) {
            return this.optional(element) || value >= param;
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/max
        max: function( value, element, param ) {
            return this.optional(element) || value <= param;
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/range
        range: function( value, element, param ) {
            return this.optional(element) || ( value >= param[0] && value <= param[1] );
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/email
        email: function(value, element) {
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
            return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/url
        url: function(value, element) {
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
            return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/date
        date: function(value, element) {
            return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
        dateISO: function(value, element) {
            return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/number
        number: function(value, element) {
            return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/digits
        digits: function(value, element) {
            return this.optional(element) || /^\d+$/.test(value);
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
        // based on http://en.wikipedia.org/wiki/Luhn
        creditcard: function(value, element) {
            if ( this.optional(element) ) {
                return "dependency-mismatch";
            }
            // accept only spaces, digits and dashes
            if (/[^0-9 \-]+/.test(value)) {
                return false;
            }
            var nCheck = 0,
                nDigit = 0,
                bEven = false;

            value = value.replace(/\D/g, "");

            for (var n = value.length - 1; n >= 0; n--) {
                var cDigit = value.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9) {
                        nDigit -= 9;
                    }
                }
                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) === 0;
        },

        // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
        equalTo: function(value, element, param) {
            // bind to the blur event of the target in order to revalidate whenever the target field is updated
            // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
            var target = $(param);
            if (this.settings.onfocusout) {
                target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    $(element).valid();
                });
            }
            return value === target.val();
        }

    }

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
    var pendingRequests = {};
    // Use a prefilter if available (1.5+)
    if ( $.ajaxPrefilter ) {
        $.ajaxPrefilter(function(settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if ( pendingRequests[port] ) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        var ajax = $.ajax;
        $.ajax = function(settings) {
            var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
                port = ( "port" in settings ? settings : $.ajaxSettings ).port;
            if (mode === "abort") {
                if ( pendingRequests[port] ) {
                    pendingRequests[port].abort();
                }
                return (pendingRequests[port] = ajax.apply(this, arguments));
            }
            return ajax.apply(this, arguments);
        };
    }
}(jQuery));

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
    // only implement if not provided by jQuery core (since 1.4)
    // TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
    if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
        $.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function( original, fix ){
            $.event.special[fix] = {
                setup:function() {
                    this.addEventListener( original, handler, true );
                },
                teardown:function() {
                    this.removeEventListener( original, handler, true );
                },
                handler: function(e) {
                    var args = arguments;
                    args[0] = $.event.fix(e);
                    args[0].type = fix;
                    return $.event.handle.apply(this, args);
                }
            };
            function handler(e) {
                e = $.event.fix(e);
                e.type = fix;
                return $.event.handle.call(this, e);
            }
        });
    }
    $.extend($.fn, {
        validateDelegate: function(delegate, type, handler) {
            return this.bind(type, function(event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
}(jQuery));

/*
 * DropKick 2.0.0
 *
 * Highly customizable <select> lists
 * https://github.com/robdel12/DropKick
 *
*/

(function( window, document, undefined ) {

window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );

var

  // Cache of DK Objects
  dkCache = [],

  // The Dropkick Object
  Dropkick = function( sel, opts ) {
    var i;

    // Prevent DK on mobile
    if ( window.isMobile && !opts.mobile ) {
      return false;
    }

    // Safety if `Dropkick` is called without `new`
    if ( this === window ) {
      return new Dropkick( sel, opts );
    }

    if ( typeof sel === "string" && sel[0] === "#" ) {
      sel = document.getElementById( sel.substr( 1 ) );
    }

    // Check if select has already been DK'd and return the DK Object
    if ( i = sel.getAttribute( "data-dkcacheid" ) ) {
      _.extend( dkCache[ i ].data.settings, opts );
      return dkCache[ i ];
    }

    if ( sel.nodeName === "SELECT" ) {
      return this.init( sel, opts );
    }
  },

  noop = function() {},

  // DK default options
  defaults = {

    // Called once after the DK element is inserted into the DOM
    initialize: noop,

    // Called every time the select changes value
    change: noop,

    // Called every time the DK element is opened
    open: noop,

    // Called every time the DK element is closed
    close: noop,

    // Search method; "strict", "partial", or "fuzzy"
    search: "strict"
  },

  // Common Utilities
  _ = {

    hasClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      return elem && reg.test( elem.className );
    },

    addClass: function( elem, classname ) {
      if( elem && !_.hasClass( elem, classname ) ) {
        elem.className += " " + classname;
      }
    },

    removeClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      elem && ( elem.className = elem.className.replace( reg, " " ) );
    },

    toggleClass: function( elem, classname ) {
      var fn = _.hasClass( elem, classname ) ? "remove" : "add";
      _[ fn + "Class" ]( elem, classname );
    },

    // Shallow object extend
    extend: function( obj ) {
      Array.prototype.slice.call( arguments, 1 ).forEach( function( source ) {
        if ( source ) for ( var prop in source ) obj[ prop ] = source[ prop ];
      });

      return obj;
    },

    // Returns the top and left offset of an element
    offset: function( elem ) {
      var box = elem.getBoundingClientRect() || { top: 0, left: 0 },
        docElem = document.documentElement;

      return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft
      };
    },

    // Returns the top and left position of an element relative to an ancestor
    position: function( elem, relative ) {
      var pos = { top: 0, left: 0 };

      while ( elem !== relative ) {
        pos.top += elem.offsetTop;
        pos.left += elem.offsetLeft;
        elem = elem.parentNode;
      }

      return pos;
    },

    // Returns the closest ancestor element of the child or false if not found
    closest: function( child, ancestor ) {
      while ( child ) {
        if ( child === ancestor ) return child;
        child = child.parentNode;
      }
      return false;
    },

    // Creates a DOM node with the specified attributes
    create: function( name, attrs ) {
      var a, node = document.createElement( name );

      if ( !attrs ) attrs = {};

      for ( a in attrs ) {
        if ( attrs.hasOwnProperty( a ) ) {
          if ( a == "innerHTML" ) {
            node.innerHTML = attrs[ a ];
          } else {
            node.setAttribute( a, attrs[ a ] );
          }
        }
      }

      return node;
    }
  };


// Extends the DK objects's Prototype
Dropkick.prototype = {

  // Emulate some of HTMLSelectElement's methods

  /**
   * Adds an element to the select
   * @param {Node}         elem   HTMLOptionElement
   * @param {Node/Integer} before HTMLOptionElement/Index of Element
   */
  add: function( elem, before ) {
    var text, option, i;

    if ( typeof elem === "string" ) {
      text = elem;
      elem = document.createElement("option");
      elem.text = text;
    }

    if ( elem.nodeName === "OPTION" ) {
      option = _.create( "li", {
        "class": "dk-option",
        "data-value": elem.value,
        "innerHTML": elem.text,
        "role": "option",
        "aria-selected": "false",
        "id": "dk" + this.data.cacheID + "-" + ( elem.id || elem.value.replace( " ", "-" ) )
      });

      _.addClass( option, elem.className );
      this.length += 1;

      if ( elem.disabled ) {
        _.addClass( option, "dk-option-disabled" );
        option.setAttribute( "aria-disabled", "true" );
      }

      this.data.select.add( elem, before );

      if ( typeof before === "number" ) {
        before = this.item( before );
      }

      if ( this.options.indexOf( before ) > -1 ) {
        before.parentNode.insertBefore( option, before );
      } else {
        this.data.elem.lastChild.appendChild( option );
      }

      option.addEventListener( "mouseover", this );

      i = this.options.indexOf( before );
      this.options.splice( i, 0, option );

      if ( elem.selected ) {
        this.select( i );
      }
    }
  },

  /**
   * Selects an option in the lists at the desired index
   * (negative numbers select from the end)
   * @param  {Integer} index Index of element (positive or negative)
   * @return {Node}          The DK option from the list, or null if not found
   */
  item: function( index ) {
    index = index < 0 ? this.options.length + index : index;
    return this.options[ index ] || null;
  },

  /**
   * Removes and element at the given index
   * @param  {Integer} index Index of element (positive or negative)
   */
  remove: function( index ) {
    var dkOption = this.item( index );
    dkOption.parentNode.removeChild( dkOption );
    this.options.splice( index, 1 );
    this.data.select.remove( index );
    this.select( this.data.select.selectedIndex );
    this.length -= 1;
  },

  /**
   * Initializes the DK Object
   * @param  {Node}   sel  [description]
   * @param  {Object} opts Options to override defaults
   * @return {Object}      The DK Object
   */
  init: function( sel, opts ) {
    var i,
      dk =  Dropkick.build( sel, "dk" + dkCache.length );

    // Set some data on the DK Object
    this.data = {};
    this.data.select = sel;
    this.data.elem = dk.elem;
    this.data.settings = _.extend({}, defaults, opts );

    // Emulate some of HTMLSelectElement's properties
    this.disabled = sel.disabled;
    this.form = sel.form;
    this.length = sel.length;
    this.multiple = sel.multiple;
    this.options = dk.options.slice( 0 );
    this.selectedIndex = sel.selectedIndex;
    this.selectedOptions = dk.selected.slice( 0 );
    this.value = sel.value;

    // Insert the DK element before the original select
    sel.parentNode.insertBefore( this.data.elem, sel );

    // Bind events
    this.data.elem.addEventListener( "click", this );
    this.data.elem.addEventListener( "keydown", this );
    this.data.elem.addEventListener( "keypress", this );

    if ( this.form ) {
      this.form.addEventListener( "reset", this );
    }

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        this.options[ i ].addEventListener( "mouseover", this );
      }
    }

    if ( dkCache.length == 0 ) {
      document.addEventListener( "click", Dropkick.onDocClick );
    }

    // Add the DK Object to the cache
    this.data.cacheID = dkCache.length;
    sel.setAttribute( "data-dkCacheId", this.data.cacheID );
    dkCache.push( this );

    // Call the optional initialize function
    this.data.settings.initialize.call( this );

    return this;
  },

  /**
   * Closes the DK dropdown
   */
  close: function() {
    var dk = this.data.elem;

    if ( !this.isOpen || this.multiple ) {
      return false;
    }

    for ( i = 0; i < this.options.length; i++ ) {
      _.removeClass( this.options[ i ], "dk-option-highlight" );
    }

    dk.lastChild.setAttribute( "aria-expanded", "false" );
    _.removeClass( dk.lastChild, "dk-select-options-highlight" );
    _.removeClass( dk, "dk-select-open-(up|down)" );
    this.isOpen = false;

    this.data.settings.close.call( this );
  },

  /**
   * Opens the DK dropdown
   */
  open: function() {
    var dropHeight, above, below,
      dk = this.data.elem,
      dkOptsList = dk.lastChild,
      dkTop = _.offset( dk ).top - window.scrollY,
      dkBottom = window.innerHeight - ( dkTop + dk.offsetHeight );

    if ( this.isOpen || this.multiple ) return false;

    dkOptsList.style.display = "block";
    dropHeight = dkOptsList.offsetHeight;
    dkOptsList.style.display = "";

    above = dkTop > dropHeight;
    below = dkBottom > dropHeight;
    direction = above && !below ? "-up" : "-down";

    this.isOpen = true;
    _.addClass( dk, "dk-select-open" + direction );
    dkOptsList.setAttribute( "aria-expanded", "true" );
    this._scrollTo( this.options.length - 1 );
    this._scrollTo( this.selectedIndex );

    this.data.settings.open.call( this );
  },

  /**
   * Disables or enables an option or the entire Dropkick
   * @param  {Node/Integer} elem     The element or index to disable
   * @param  {Boolean}      disabled Value of disabled
   */
  disable: function( elem, disabled ) {
    var disabledClass = "dk-option-disabled";

    if ( arguments.length == 0 || typeof elem === "boolean" ) {
      disabled = elem === undefined ? true : false;
      elem = this.data.elem;
      disabledClass = "dk-select-disabled";
      this.disabled = disabled;
    }

    if ( disabled == undefined ) {
      disabled = true;
    }

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    _[ disabled ? "addClass" : "removeClass" ]( elem, disabledClass );
  },

  /**
   * Selects an option from the list
   * @param  {Node/Integer} elem     The element or index to select
   * @param  {Boolean}      disabled Selects disabled options
   * @return {Node}                  The selected element
   */
  select: function( elem, disabled ) {
    var index, option, combobox,
      select = this.data.select;

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    if ( !disabled && _.hasClass( elem, "dk-option-disabled" ) ) return false;

    if ( _.hasClass( elem, "dk-option" ) ) {
      index = this.options.indexOf( elem );
      option = select.options[ index ];

      if ( this.multiple ) {
        _.toggleClass( elem, "dk-option-selected" );
        option.selected = !option.selected;

        if ( _.hasClass( elem, "dk-option-selected" ) ) {
          elem.setAttribute( "aria-selected", "true" );
          this.selectedOptions.push( elem );
        } else {
          elem.setAttribute( "aria-selected", "false" );
          index = this.selectedOptions.indexOf( elem );
          this.selectedOptions.splice( index, 1 );
        }
      } else {
        combobox = this.data.elem.firstChild;

        if ( this.selectedOptions.length ) {
          _.removeClass( this.selectedOptions[0], "dk-option-selected" );
          this.selectedOptions[0].setAttribute( "aria-selected", "false" );
        }

        _.addClass( elem, "dk-option-selected" );
        elem.setAttribute( "aria-selected", "true" );

        combobox.setAttribute( "aria-activedescendant", elem.id );
        combobox.innerHTML = option.text;

        this.selectedOptions[0] = elem;
        option.selected = true;
      }

      this.selectedIndex = select.selectedIndex;
      this.value = select.value;
      this.data.settings.change( this );

      return elem;
    }
  },

  /**
   * Selects a single option from the list
   * @param  {Node/Integer} elem     The element or index to select
   * @param  {Boolean}      disabled Selects disabled options
   * @return {Node}                  The selected element
   */
  selectOne: function( elem, disabled ) {
    this.reset( true );
    this._scrollTo( elem );
    return this.select( elem, disabled );
  },

  /**
   * Finds all options who's text matches a pattern (strict, partial, or fuzzy)
   * @param  {String} string  The string to search for
   * @param  {Integer} mode   How to search; "strict", "partial", or "fuzzy"
   * @return {Array/Boolean}  An Array of matched elements
   */
  search: function( pattern, mode ) {
    var i, tokens, str, tIndex, sIndex, cScore, tScore, reg,
      options = this.data.select.options,
      matches = [];

    if ( !pattern ) return this.options;

    // Fix Mode
    mode = mode ? mode.toLowerCase() : "strict";
    mode = mode == "fuzzy" ? 2 : mode == "partial" ? 1 : 0;

    reg = new RegExp( ( mode ? "" : "^" ) + pattern, "i" );

    for ( i = 0; i < options.length; i++ ) {
      str = options[ i ].text.toLowerCase();

      // Fuzzy
      if ( mode == 2 ) {
        tokens = pattern.toLowerCase().split("");
        tIndex = sIndex = cScore = tScore = 0;

        while ( sIndex < str.length ) {
          if ( str[ sIndex ] === tokens[ tIndex ] ) {
            cScore += 1 + cScore;
            tIndex++;
          } else {
            cScore = 0;
          }

          tScore += cScore;
          sIndex++;
        }

        if ( tIndex == tokens.length ) {
          matches.push({ e: this.options[ i ], s: tScore, i: i });
        }

      // Partial or Strict (Default)
      } else {
        reg.test( str ) && matches.push( this.options[ i ] );
      }
    }

    // Sort fuzzy results
    if ( mode == 2 ) {
      matches = matches.sort( function ( a, b ) {
        return ( b.s - a.s ) || a.i - b.i;
      }).reduce( function ( p, o ) {
        p[ p.length ] = o.e;
        return p;
      }, [] );
    }

    return matches;
  },

  /**
   * Resets the DK and select element
   * @param  {Boolean} clear Defaults to first option if True
   */
  reset: function( clear ) {
    var i,
      select = this.data.select;

    this.selectedOptions.length = 0;

    for ( i = 0; i < select.options.length; i++ ) {
      select.options[ i ].selected = false;
      _.removeClass( this.options[ i ], "dk-option-selected" );
      this.options[ i ].setAttribute( "aria-selected", "false" );
      if ( !clear && select.options[ i ].defaultSelected ) {
        this.select( i, true );
      }
    }

    if ( !this.selectedOptions.length && !this.multiple ) {
      this.select( 0, true );
    }
  },

  /**
   * Rebuilds the DK Object
   * (use if HTMLSelectElement has changed)
   */
  refresh: function() {
    dkCache.splice( this.data.cacheID, 1 );
    this.data.elem.parentNode.removeChild( this.data.elem );
    this.init( this.data.select, this.data.settings );
  },


  // Private Methods

  handleEvent: function( event ) {
    if ( this.disabled ) return;

    switch ( event.type ) {
    case "click":
      this._delegate( event );
      break;
    case "keydown":
      this._keyHandler( event );
      break;
    case "keypress":
      this._searchOptions( event );
      break;
    case "mouseover":
      this._highlight( event );
      break;
    case "reset":
      this.reset();
      break;
    }
  },

  _delegate: function( event ) {
    var selection, index, firstIndex, lastIndex,
      target = event.target;

    if ( _.hasClass( target, "dk-option-disabled" ) ) {
      return false;
    }

    if ( !this.multiple ) {
      this[ this.isOpen ? "close" : "open" ]();
      if ( _.hasClass( target, "dk-option" ) ) this.select( target );
    } else {
      if ( _.hasClass( target, "dk-option" ) ) {
        selection = window.getSelection();
        if ( selection.type == "Range" ) selection.collapseToStart();

        if ( event.shiftKey ) {
          firstIndex = this.options.indexOf( this.selectedOptions[0] );
          lastIndex = this.options.indexOf( this.selectedOptions[ this.selectedOptions.length - 1 ] );
          index =  this.options.indexOf( target );

          if ( index > firstIndex && index < lastIndex ) index = firstIndex;
          if ( index > lastIndex && lastIndex > firstIndex ) lastIndex = firstIndex;

          this.reset( true );

          if ( lastIndex > index ) {
            while ( index < lastIndex + 1 ) this.select( index++ );
          } else {
            while ( index > lastIndex - 1 ) this.select( index-- );
          }
        } else if ( event.ctrlKey || event.metaKey ) {
          this.select( target );
        } else {
          this.reset( true );
          this.select( target );
        }
      }
    }
  },

  _highlight: function( event ) {
    var i, option = event.target;

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        _.removeClass( this.options[ i ], "dk-option-highlight" );
      }

      _.addClass( this.data.elem.lastChild, "dk-select-options-highlight" );
      _.addClass( option, "dk-option-highlight" );
    }
  },

  _keyHandler: function( event ) {
    var lastSelected,
      selected = this.selectedOptions,
      options = this.options,
      i = 1,
      keys = {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        up: 38,
        down: 40
      };

    switch ( event.keyCode ) {
    case keys.up:
      i = -1;
      // deliberate fallthrough
    case keys.down:
      event.preventDefault();
      lastSelected = selected[ selected.length - 1 ];
      i = options.indexOf( lastSelected ) + i;

      if ( i > options.length - 1 ) {
        i = options.length - 1;
      } else if ( i < 0 ) {
        i = 0;
      }

      if ( !this.data.select.options[ i ].disabled ) {
        this.reset( true );
        this.select( i );
        this._scrollTo( i );
      }
      break;
    case keys.space:
      if ( !this.isOpen ) {
        event.preventDefault();
        this.open();
        break;
      }
      // deliberate fallthrough
    case keys.tab:
    case keys.enter:
      for ( i = 0; i < options.length; i++ ) {
        if ( _.hasClass( options[ i ], "dk-option-highlight" ) ) {
          this.select( i );
        }
      }
      // deliberate fallthrough
    case keys.esc:
      if ( this.isOpen ) {
        event.preventDefault();
        this.close();
      }
      break;
    }
  },

  _searchOptions: function( event ) {
    var results,
      self = this,
      keyChar = String.fromCharCode( event.keyCode || event.which ),

      waitToReset = function() {
        if ( self.data.searchTimeout ) {
          clearTimeout( self.data.searchTimeout );
        }

        self.data.searchTimeout = setTimeout(function() {
          self.data.searchString = "";
        }, 1000 );
      };

    if ( this.data.searchString === undefined ) {
      this.data.searchString = "";
    }

    waitToReset();

    this.data.searchString += keyChar;
    results = this.search( this.data.searchString, this.data.settings.search );

    if ( results.length ) {
      if ( !_.hasClass( results[0], "dk-option-disabled" ) ) {
        this.selectOne( results[0] );
      }
    }
  },

  _scrollTo: function( option ) {
    var optPos, optTop, optBottom,
      dkOpts = this.data.elem.lastChild;

    if ( !this.isOpen && !this.multiple ) {
      return false;
    }

    if ( typeof option === "number" ) {
      option = this.item( option );
    }

    optPos = _.position( option, dkOpts ).top;
    optTop = optPos - dkOpts.scrollTop;
    optBottom = optTop + option.offsetHeight;

    if ( optBottom > dkOpts.offsetHeight ) {
      optPos += option.offsetHeight;
      dkOpts.scrollTop = optPos - dkOpts.offsetHeight;
    } else if ( optTop < 0 ) {
      dkOpts.scrollTop = optPos;
    }
  }
};

// Static Methods

/**
 * Builds the Dropkick element from a select element
 * @param  {Node} sel The HTMLSelectElement
 * @return {Object}   An object containing the new DK element and it's options
 */
Dropkick.build = function( sel, idpre ) {
  var optList, i,
    options = [],

    ret = {
      elem: null,
      options: [],
      selected: []
    },

    addOption = function ( node ) {
      var option, optgroup, optgroupList, i,
        children = [];

      switch ( node.nodeName ) {
      case "OPTION":
        option = _.create( "li", {
          "class": "dk-option",
          "data-value": node.value,
          "innerHTML": node.text,
          "role": "option",
          "aria-selected": "false",
          "id": idpre + "-" + ( node.id || node.value.replace( " ", "-" ) )
        });

        _.addClass( option, node.className );

        if ( node.disabled ) {
          _.addClass( option, "dk-option-disabled" );
          option.setAttribute( "aria-disabled", "true" );
        }

        if ( node.selected ) {
          _.addClass( option, "dk-option-selected" );
          option.setAttribute( "aria-selected", "true" );
          ret.selected.push( option );
        }

        ret.options.push( this.appendChild( option ) );
        break;
      case "OPTGROUP":
        optgroup = _.create( "li", { "class": "dk-optgroup" });

        if ( node.label ) {
          optgroup.appendChild( _.create( "div", {
            "class": "dk-optgroup-label",
            "innerHTML": node.label
          }));
        }

        optgroupList = _.create( "ul", {
          "class": "dk-optgroup-options",
        });

        for ( i = node.children.length; i--; children.unshift( node.children[ i ] ) );
        children.forEach( addOption, optgroupList );

        this.appendChild( optgroup ).appendChild( optgroupList );
        break;
      }
    };

  ret.elem = _.create( "div", {
    "class": "dk-select" + ( sel.multiple ? "-multi" : "" )
  });

  optList = _.create( "ul", {
    "class": "dk-select-options",
    "id": idpre + "-listbox",
    "role": "listbox"
  });

  sel.disabled && _.addClass( ret.elem, "dk-select-disabled" );
  ret.elem.id = idpre + ( sel.id ? "-" + sel.id : "" );
  _.addClass( ret.elem, sel.className );

  if ( !sel.multiple ) {
    ret.elem.appendChild( _.create( "div", {
      "class": "dk-selected",
      "tabindex": sel.tabindex || 0,
      "innerHTML": sel.options[ sel.selectedIndex ].text,
      "id": idpre + "-combobox",
      "aria-live": "assertive",
      "aria-owns": optList.id,
      "role": "combobox"
    }));
    optList.setAttribute( "aria-expanded", "false" );
  } else {
    ret.elem.setAttribute( "tabindex", sel.getAttribute( "tabindex" ) || "0" );
    optList.setAttribute( "aria-multiselectable", "true" );
  }

  for ( i = sel.children.length; i--; options.unshift( sel.children[ i ] ) );
  options.forEach( addOption, ret.elem.appendChild( optList ) );

  return ret;
};

/**
 * Focus DK Element when corresponding label is clicked; close all other DK's
 */
Dropkick.onDocClick = function( event ) {
  var t, tId, i;

  if ( t = document.getElementById( event.target.htmlFor ) ) {
    if ( ( tId = t.getAttribute( "data-dkcacheid" ) ) !== null ) {
      dkCache[ tId ].data.elem.focus();
    }
  }

  for ( i = 0; i < dkCache.length; i++ ) {
    if ( !_.closest( event.target, dkCache[ i ].data.elem ) ) {
      dkCache[ i ].disabled || dkCache[ i ].close();
    }
  }
};


// Expose Dropkick Globally
window.Dropkick = Dropkick;

})( window, document );


var Froogaloop = (function(){
    // Define a local copy of Froogaloop
    function Froogaloop(iframe) {
        // The Froogaloop object is actually just the init constructor
        return new Froogaloop.fn.init(iframe);
    }

    var eventCallbacks = {},
        hasWindowEvent = false,
        isReady = false,
        slice = Array.prototype.slice,
        playerDomain = '';

    Froogaloop.fn = Froogaloop.prototype = {
        element: null,

        init: function(iframe) {
            if (typeof iframe === "string") {
                iframe = document.getElementById(iframe);
            }

            this.element = iframe;

            // Register message event listeners
            playerDomain = getDomainFromUrl(this.element.getAttribute('src'));

            return this;
        },

        /*
         * Calls a function to act upon the player.
         *
         * @param {string} method The name of the Javascript API method to call. Eg: 'play'.
         * @param {Array|Function} valueOrCallback params Array of parameters to pass when calling an API method
         *                                or callback function when the method returns a value.
         */
        api: function(method, valueOrCallback) {
            if (!this.element || !method) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                params = !isFunction(valueOrCallback) ? valueOrCallback : null,
                callback = isFunction(valueOrCallback) ? valueOrCallback : null;

            // Store the callback for get functions
            if (callback) {
                storeCallback(method, callback, target_id);
            }

            postMessage(method, params, element);
            return self;
        },

        /*
         * Registers an event listener and a callback function that gets called when the event fires.
         *
         * @param eventName (String): Name of the event to listen for.
         * @param callback (Function): Function that should be called when the event fires.
         */
        addEvent: function(eventName, callback) {
            if (!this.element) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null;


            storeCallback(eventName, callback, target_id);

            // The ready event is not registered via postMessage. It fires regardless.
            if (eventName != 'ready') {
                postMessage('addEventListener', eventName, element);
            }
            else if (eventName == 'ready' && isReady) {
                callback.call(null, target_id);
            }

            return self;
        },

        /*
         * Unregisters an event listener that gets called when the event fires.
         *
         * @param eventName (String): Name of the event to stop listening for.
         */
        removeEvent: function(eventName) {
            if (!this.element) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                removed = removeCallback(eventName, target_id);

            // The ready event is not registered
            if (eventName != 'ready' && removed) {
                postMessage('removeEventListener', eventName, element);
            }
        }
    };

    /**
     * Handles posting a message to the parent window.
     *
     * @param method (String): name of the method to call inside the player. For api calls
     * this is the name of the api method (api_play or api_pause) while for events this method
     * is api_addEventListener.
     * @param params (Object or Array): List of parameters to submit to the method. Can be either
     * a single param or an array list of parameters.
     * @param target (HTMLElement): Target iframe to post the message to.
     */
    function postMessage(method, params, target) {
        if (!target.contentWindow.postMessage) {
            return false;
        }

        var url = target.getAttribute('src').split('?')[0],
            data = JSON.stringify({
                method: method,
                value: params
            });

        if (url.substr(0, 2) === '//') {
            url = window.location.protocol + url;
        }

        target.contentWindow.postMessage(data, url);
    }

    /**
     * Event that fires whenever the window receives a message from its parent
     * via window.postMessage.
     */
    function onMessageReceived(event) {
        var data, method;

        try {
            data = JSON.parse(event.data);
            method = data.event || data.method;
        }
        catch(e)  {
            //fail silently... like a ninja!
        }

        if (method == 'ready' && !isReady) {
            isReady = true;
        }

        // Handles messages from moogaloop only
        if (event.origin != playerDomain) {
            return false;
        }

        var value = data.value,
            eventData = data.data,
            target_id = target_id === '' ? null : data.player_id,

            callback = getCallback(method, target_id),
            params = [];

        if (!callback) {
            return false;
        }

        if (value !== undefined) {
            params.push(value);
        }

        if (eventData) {
            params.push(eventData);
        }

        if (target_id) {
            params.push(target_id);
        }

        return params.length > 0 ? callback.apply(null, params) : callback.call();
    }


    /**
     * Stores submitted callbacks for each iframe being tracked and each
     * event for that iframe.
     *
     * @param eventName (String): Name of the event. Eg. api_onPlay
     * @param callback (Function): Function that should get executed when the
     * event is fired.
     * @param target_id (String) [Optional]: If handling more than one iframe then
     * it stores the different callbacks for different iframes based on the iframe's
     * id.
     */
    function storeCallback(eventName, callback, target_id) {
        if (target_id) {
            if (!eventCallbacks[target_id]) {
                eventCallbacks[target_id] = {};
            }
            eventCallbacks[target_id][eventName] = callback;
        }
        else {
            eventCallbacks[eventName] = callback;
        }
    }

    /**
     * Retrieves stored callbacks.
     */
    function getCallback(eventName, target_id) {
        if (target_id) {
            return eventCallbacks[target_id][eventName];
        }
        else {
            return eventCallbacks[eventName];
        }
    }

    function removeCallback(eventName, target_id) {
        if (target_id && eventCallbacks[target_id]) {
            if (!eventCallbacks[target_id][eventName]) {
                return false;
            }
            eventCallbacks[target_id][eventName] = null;
        }
        else {
            if (!eventCallbacks[eventName]) {
                return false;
            }
            eventCallbacks[eventName] = null;
        }

        return true;
    }

    /**
     * Returns a domain's root domain.
     * Eg. returns http://vimeo.com when http://vimeo.com/channels is sbumitted
     *
     * @param url (String): Url to test against.
     * @return url (String): Root domain of submitted url
     */
    function getDomainFromUrl(url) {
        if (url.substr(0, 2) === '//') {
            url = window.location.protocol + url;
        }

        var url_pieces = url.split('/'),
            domain_str = '';

        for(var i = 0, length = url_pieces.length; i < length; i++) {
            if(i<3) {domain_str += url_pieces[i];}
            else {break;}
            if(i<2) {domain_str += '/';}
        }

        return domain_str;
    }

    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    // Give the init function the Froogaloop prototype for later instantiation
    Froogaloop.fn.init.prototype = Froogaloop.fn;

    // Listens for the message event.
    // W3C
    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    }
    // IE
    else {
        window.attachEvent('onmessage', onMessageReceived);
    }

    // Expose froogaloop to the global object
    return (window.Froogaloop = window.$f = Froogaloop);

})();

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2014 Rico Sta. Cruz
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/* jshint expr: true */

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }

}(this, function($) {

  $.transit = {
    version: "0.9.12",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft    : 'margin',
      marginRight   : 'margin',
      marginBottom  : 'margin',
      marginTop     : 'margin',
      paddingLeft   : 'padding',
      paddingRight  : 'padding',
      paddingBottom : 'padding',
      paddingTop    : 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: false
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (var i=0; i<prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) { return vendorProp; }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  support.transition      = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform       = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.filter          = getVendorPropertyName('Filter');
  support.transform3d     = checkTransform3dSupport();

  var eventNames = {
    'transition':       'transitionend',
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  // Detect the 'transitionend' event needed.
  var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

  // Populate jQuery's `$.support` with the vendor prefixes we know.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  for (var key in support) {
    if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
      $.support[key] = support[key];
    }
  }

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    '_default':       'ease',
    'in':             'ease-in',
    'out':            'ease-out',
    'in-out':         'ease-in-out',
    'snap':           'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks['transit:transform'] = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform') || new Transform();
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !isChrome) {
        elem.style[support.transform] = value.toString(true);
      } else {
        elem.style[support.transform] = value.toString();
      }

      $(elem).data('transform', value);
    }
  };

  // Add a CSS hook for `.css({ transform: '...' })`.
  // In jQuery 1.8+, this will intentionally override the default `transform`
  // CSS hook so it'll play well with Transit. (see issue #62)
  $.cssHooks.transform = {
    set: $.cssHooks['transit:transform'].set
  };

  // ## 'filter' CSS hook
  // Allows you to use the `filter` property in CSS.
  //
  //     $("#hello").css({ filter: 'blur(10px)' });
  //
  $.cssHooks.filter = {
    get: function(elem) {
      return elem.style[support.filter];
    },
    set: function(elem, value) {
      elem.style[support.filter] = value;
    }
  };

  // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
  // be necessary.
  if ($.fn.jquery < "1.8") {
    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
      get: function(elem) {
        return elem.style[support.transformOrigin];
      },
      set: function(elem, value) {
        elem.style[support.transformOrigin] = value;
      }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
      get: function(elem) {
        return elem.style[support.transition];
      },
      set: function(elem, value) {
        elem.style[support.transition] = value;
      }
    };
  }

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('scaleX');
  registerCssHook('scaleY');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') { this.parse(str); }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) { y = x; }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) { this._translateX = 0; }
        if (this._translateY === undefined) { this._translateY = 0; }

        if (x !== null && x !== undefined) { this._translateX = unit(x, 'px'); }
        if (y !== null && y !== undefined) { this._translateY = unit(y, 'px'); }

        this.translate = this._translateX + "," + this._translateY;
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) { s[0] = parseFloat(s[0]); }
        if (s[1]) { s[1] = parseFloat(s[1]); }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i=0; i<=3; ++i) {
          if (s[i]) { s[i] = parseFloat(s[i]); }
        }
        if (s[3]) { s[3] = unit(s[3], 'deg'); }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
            (i === 'rotateX') ||
            (i === 'rotateY') ||
            (i === 'perspective') ||
            (i === 'transformOrigin'))) { continue; }

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            } else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            } else {
              re.push(i + "(" + this[i] + ")");
            }
          }
        }
      }

      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {
    if (queue === true) {
      self.queue(fn);
    } else if (queue) {
      self.queue(queue, fn);
    } else {
      self.each(function () {
                fn.call(this);
            });
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || $.cssProps[key] || key;
      key = uncamel(key); // Convert back to dasherized

      // Get vendor specify propertie
      if (support[key])
        key = uncamel(support[key]);

      if ($.inArray(key, re) === -1) { re.push(key); }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);

    // Account for aliases (`in` => `ease-in`).
    if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    var attribs = '' + toMS(duration) + ' ' + easing;
    if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."
    var transitions = [];
    $.each(props, function(i, name) {
      transitions.push(name + ' ' + attribs);
    });

    return transitions.join(', ');
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //
  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self  = this;
    var delay = 0;
    var queue = true;

    var theseProperties = $.extend(true, {}, properties);

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, options)`.
    if (typeof duration === 'object') {
      easing = duration.easing;
      delay = duration.delay || 0;
      queue = typeof duration.queue === "undefined" ? true : duration.queue;
      callback = duration.complete;
      duration = duration.duration;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof theseProperties.easing !== 'undefined') {
      easing = theseProperties.easing;
      delete theseProperties.easing;
    }

    if (typeof theseProperties.duration !== 'undefined') {
      duration = theseProperties.duration;
      delete theseProperties.duration;
    }

    if (typeof theseProperties.complete !== 'undefined') {
      callback = theseProperties.complete;
      delete theseProperties.complete;
    }

    if (typeof theseProperties.queue !== 'undefined') {
      queue = theseProperties.queue;
      delete theseProperties.queue;
    }

    if (typeof theseProperties.delay !== 'undefined') {
      delay = theseProperties.delay;
      delete theseProperties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
    if (typeof easing === 'undefined')   { easing = $.cssEase._default; }

    duration = toMS(duration);

    // Build the `transition` property.
    var transitionValue = getTransition(theseProperties, duration, easing, delay);

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(theseProperties);
        if (callback) { callback.apply(self); }
        if (next) { next(); }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { self.unbind(transitionEnd, cb); }

        if (i > 0) {
          self.each(function() {
            this.style[support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') { callback.apply(self); }
        if (typeof nextCall === 'function') { nextCall(); }
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.bind(transitionEnd, cb);
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function() {
        if (i > 0) {
          this.style[support.transition] = transitionValue;
        }
        $(this).css(theseProperties);
      });
    };

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
        this.offsetWidth; // force a repaint
        run(next);
    };

    // Use jQuery's fx queue.
    callOrQueue(self, queue, deferredRun);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) { $.cssNumber[prop] = true; }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transit:transform');
        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transit:transform');
        t.setFromString(prop, value);

        $(elem).css({ 'transit:transform': t });
      }
    };

  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  // toMS('fast') => $.fx.speeds[i] => "200ms"
  // toMS('normal') //=> $.fx.speeds._default => "400ms"
  // toMS(10) //=> '10ms'
  // toMS('100ms') //=> '100ms'  
  //
  function toMS(duration) {
    var i = duration;

    // Allow string durations like 'fast' and 'slow', without overriding numeric values.
    if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) { i = $.fx.speeds[i] || $.fx.speeds._default; }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;

  return $;
}));
