/*
 * MrMonkey - CKEditor plugin for mocking user actions.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Leppä / Foyt
 * antti.leppa@foyt.fi
 */
(function() {
  
  var ValidatePositiveNumber = function (message) {
    return function() {
      var value = this.getValue();
      var valid = value && CKEDITOR.dialog.validate.integer()(value) && (value > 0);
      if ( !valid) {
        alert(message);
      }

      return valid;
    };
  };
  
  CKEDITOR.dialog.add('myMonkeySettingsDialog', function( editor ) {
  	return {
  		title: 'Mr. Monkey Settings',
  		minWidth: 400,
  		minHeight: 200,
  		contents: [
  			{
  				id: 'tab-typing',
  				label: 'Typing',
  				elements: [
            {
              type: 'checkbox',
              id: 'typeRandom',
              label: 'Type Randomly',
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            },
  					{
  						type: 'text',
  						id: 'typeRandomInterval',
  						label: 'Type Interval',
    					validate: ValidatePositiveNumber("'Type Interval' must be a positive a number"),
  						setup: function( element ) {
  							this.setValue( element[this.id] );
  						},
  						commit: function( element ) {
  							element[this.id] = this.getValue();
  						}
  					},
            {
              type: 'text',
              id: 'typeRandomKeys',
              label: 'Keys',
              validate: function() {
                var value = this.getValue();
                var emptyString = !(value && (typeof value) == 'string');
                var invalidContents = false;
                
                if (!emptyString) {
                  var keys = value.split(',');
                  for (var i = 0, l = keys.length; i < l; i++) {
                    var key = keys[i];
                    // If length of the item is 1 its a character
                    if (key.length != 1) {
                      if (key.length > 0) {
                        // Otherwise it should be a number prefixed by #
                        if (key[0] == '#') {
                          var code = key.substring(1);
                          if (isNaN(parseInt(code))) {
                            invalidContents = true;
                            break;
                          }
                        } else {
                          invalidContents = true;
                          break;
                        }
                      } else {
                        // If item is empty, it cannot be valid
                        invalidContents = true;
                        break;
                      }
                    }
                  }
                }
                
                if (emptyString) {
                  alert( 'Keys setting can not be empty' );
                  return false;
                } else if (invalidContents) {
                  alert( 'Keys must be a comma separated list of characters or char codes prefixed by #' );
                  return false;
                } else {
                  return true;
                }
              },
              setup: function( element ) {
                var value = new Array();
                for (var i = 0, l = element[this.id].length; i < l; i++) {
                  if ((typeof element[this.id][i]) == 'number') {
                    value.push('#' + element[this.id][i]);
                  } else {
                    value.push(element[this.id][i]);
                  }
                }
                
                this.setValue(value);
              },
              commit: function( element ) {
                var keys = this.getValue().split(',');
                var value = new Array();
                
                for (var i = 0, l = keys.length; i < l; i++) {
                  var key = keys[i];
                  // If length of the item is 1 its a character
                  if (key.length == 1) {
                    value.push(key);
                  } else {
                    // Otherwise it's a char code
                    if (key.length > 0) {
                      if (key[0] == '#') {
                        value.push(parseInt(key.substring(1)));
                      }
                    }
                  }
                }
                
                element[this.id] = value;
              }
            },
            {
              type: 'text',
              id: 'typeRandomMaxKeyStrokesAtOnce',
              label: 'Max Key Strokes at Once',
              validate: ValidatePositiveNumber("'Max Key Strokes at Once' must be a positive a number"),
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            },
            {
              type: 'text',
              id: 'typeRandomKeyStrokeInterval',
              label: 'Key Stroke Interval',
              validate: ValidatePositiveNumber("'Key Stroke Interval' must be a positive a number"),
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            }
  				]
  			},
  
        {
          id: 'tab-lorem-paste',
          label: 'Paste Lorem Ipsum',
          elements: [
            {
              type: 'checkbox',
              id: 'pasteLoremIpsum',
              label: 'Randomly Paste Lorem Ipsum',
              validate: function() {
              },
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            },
            {
              type: 'text',
              id: 'pasteLoremIpsumInterval',
              label: 'Paste Interval',
              validate: ValidatePositiveNumber("'Paste Interval' must be a positive a number"),
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            },
            {
              type: 'text',
              id: 'pasteLoremIpsumBlockSize',
              label: 'Paste Block Size',
              validate: ValidatePositiveNumber("'Paste Block Size' must be a positive a number"),
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            },
            {
              type: 'textarea',
              id: 'pasteLoremIpsumText',
              label: 'Text',
              validate: CKEDITOR.dialog.validate.notEmpty( "Text field cannot be empty" ),
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            }
          ]
        },
  
        {
          id: 'tab-selection',
          label: 'Selection',
          elements: [
            {
              type: 'checkbox',
              id: 'selectionChange',
              label: 'Randomly Change Selection',
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            },
            {
              type: 'text',
              id: 'selectionChangeInterval',
              label: 'Selection Change Interval',
              validate: ValidatePositiveNumber("'Selection Change Interval' must be a positive a number"),
              setup: function( element ) {
                this.setValue( element[this.id] );
              },
              commit: function( element ) {
                element[this.id] = this.getValue();
              }
            }
          ]
        }
  		],
  
  		onShow: function() {
  		  this.setupContent(editor.getMrMonkeySettings());
  		},
  
  		onOk: function() {
  		  var settings = {};
  		  this.commitContent(settings);
  		  editor.setMrMonkeySettings(settings);
  		}
  	};
  });
  
}).call(this);