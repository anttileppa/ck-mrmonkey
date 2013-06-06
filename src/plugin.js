/*
 * MrMonkey - CKEditor plugin for simulating user actions.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Leppä / Foyt
 * antti.leppa@foyt.fi
 * 
 * This plugin can be used to simulate user actions such as moving cursor, typing and pasting. 
 * 
 * Toggle button icon is created from:
 * http://openclipart.org/detail/175261/monkey-head-by-antti.leppa-175261
 * 
 * And settings button from:
 * http://openclipart.org/detail/101335/cartoon-monkey-with-wrench-by-bnielsen
 */

(function() {

  CKEDITOR.plugins.add( 'mrmonkey', { 
    icons: 'togglemrmonkey,mrmonkeysettings',
    init: function( editor ) {  
      var defaults = {
        pasteLoremIpsumInterval: 1000 * 2,
        typeRandomInterval: 1000 * 2,
        selectionChangeInterval: 1000 * 2,
        pasteLoremIpsum: false,
        typeRandom: true,
        selectionChange: true,
        typeRandomMaxKeyStrokesAtOnce: 10,
        typeRandomKeyStrokeInterval: 1000,
        pasteLoremIpsumBlockSize: 200,
        typeRandomKeys: [13, 32, 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        pasteLoremIpsumText: 
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel scelerisque nunc. Integer condimentum quam ut velit lobortis at tincidunt felis viverr' + 
          'a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque auctor mauris sed urna dictum fringilla. Donec' + 
          ' vel egestas quam. Maecenas faucibus pulvinar ante vitae imperdiet. Sed a augue ac nisl volutpat mattis eu a nisl. Mauris consectetur suscipit neque, ' + 
          'eu fermentum elit sollicitudin eu.\n' + 
          'Proin porttitor fermentum tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec sapien ipsum, f' + 
          'eugiat eget ornare ac, facilisis et nulla. Donec vel ante diam. Ut dui est, consequat eu placerat ut, varius et tortor. Vivamus dictum eros ac ante al' + 
          'iquet ut bibendum libero egestas. Vivamus accumsan dignissim accumsan.\n' + 
          'Pellentesque consectetur tellus quis orci ultrices vitae lacinia risus lacinia. Vestibulum gravida mi rhoncus dolor porta aliquet. Phasellus nec vulpu' + 
          'tate dolor. Sed in massa ac massa blandit imperdiet. Vestibulum mollis rhoncus rhoncus. Integer turpis ligula, condimentum venenatis rhoncus non, vest' + 
          'ibulum a velit. Pellentesque nulla ipsum, convallis at cursus non, pharetra eget dolor. Proin suscipit urna tempus erat eleifend non consequat augue f' + 
          'ringilla. Nam at imperdiet neque. Donec vulputate, leo quis posuere varius, est ipsum congue mi, in suscipit urna nulla sit amet tellus. Donec ut libe' + 
          'ro velit. Ut et massa lectus. Integer pretium commodo nulla a mollis.'
      };
      
      var settings = {};
      
      if ((typeof(Storage) !== "undefined") && localStorage.mrMonkeySettings) {
        settings = JSON.parse(localStorage.mrMonkeySettings);
      }
      
      CKEDITOR.tools.extend( CKEDITOR.editor.prototype, {
        getMrMonkeySettings: function () {
          return CKEDITOR.tools.extend(CKEDITOR.tools.extend(CKEDITOR.tools.extend({}, settings), editor.config.mrmonkey||{}), defaults); 
        },
        getMrMonkeySetting: function (name) {
          if (settings[name] !== undefined) {
            return settings[name];
          } else if (editor.config.mrmonkey && (editor.config.mrmonkey[name] != undefined)) {
            return editor.config.mrmonkey[name];
          } else {
            return defaults[name];
          }
        },
        setMrMonkeySetting: function (name, value) {
          settings[name] = value;
        },
        setMrMonkeySettings: function (s) {
          settings = s;

          if (typeof(Storage) !== "undefined") {
            localStorage.mrMonkeySettings = JSON.stringify(settings);
          }
        },
        isMrMonkeyRunning: function () {
          return this.getCommand('toggleMrMonkey').state == CKEDITOR.TRISTATE_ON;
        }
      });

      function scheduleLoremIpsum(editor) {
        CKEDITOR.tools.setTimeout(function() {
          if (editor.isMrMonkeyRunning()) {
            editor.fire('mrmonkey:pasteLoremIpsum');
          }
        }, editor.getMrMonkeySetting('pasteLoremIpsumInterval'));
      }
  
      function scheduleRandomTyping(editor) {
        CKEDITOR.tools.setTimeout(function() {
          if (editor.isMrMonkeyRunning()) {
            editor.fire('mrmonkey:randomTyping');
          }
        }, editor.getMrMonkeySetting('typeRandomInterval'));
      }
      
      function scheduleSelectionChange(editor) {
        CKEDITOR.tools.setTimeout(function() {
          if (editor.isMrMonkeyRunning()) {
            editor.fire('mrmonkey:changeSelection');
          }
        }, editor.getMrMonkeySetting('selectionChangeInterval'));
      }

      editor.on('mrmonkey:randomTyping', function (event) {
        var characters = Math.round(Math.random() * editor.getMrMonkeySetting('typeRandomMaxKeyStrokesAtOnce'));
        var keypressTimeout = 0;
        while (characters >= 0) {
          keypressTimeout += Math.round(Math.random() * editor.getMrMonkeySetting('typeRandomKeyStrokeInterval')); 
          CKEDITOR.tools.setTimeout(function() {
            var selection = editor.getSelection();    
            if (selection && (selection.getRanges().length > 0)) {
              var keys = editor.getMrMonkeySetting('typeRandomKeys');
              var codes = keys.length - 1;
              var index = Math.round(Math.random() * codes);
              var key = keys[index];
              var keyCode = null;
              if ((typeof key) == 'number') {
                keyCode = key; 
              } else {
                keyCode = key.charCodeAt(0);
              }
              
              // Simulate key event        
              editor.fire('key', {
                keyCode: keyCode
              });
            
              // Add character into the editor
              editor.insertHtml(String.fromCharCode(keyCode));              
            } else {
              // We have lost selection somehow so we need to select something and try again
              editor.fire('mrmonkey:changeSelection');
            }
          }, keypressTimeout);
          
          characters--;
        }
        
        scheduleRandomTyping(event.editor);
      });
        
      editor.on('mrmonkey:pasteLoremIpsum', function (event) {
        // Get random data
        var loremIpsumText = editor.getMrMonkeySetting('pasteLoremIpsumText');
        var loremIpsumLength = loremIpsumText.length;
        var blockSize = editor.getMrMonkeySetting('pasteLoremIpsumBlockSize');
        var characters = Math.round((Math.random() * blockSize) + 1);
        var offset = Math.round(Math.random() * (loremIpsumLength - characters) - 1);
        var data = loremIpsumText.substring(offset, offset + characters);
        
        // Simulate beforepaste event
        editor.fire( 'beforePaste', {
          type: 'auto' 
        });
        
        // Simulate paste event
        editor.fire( 'paste', {
          type: 'auto',
          dataValue: data
        });
        
        // Schedule new lorem paste      
        scheduleLoremIpsum(event.editor);
      });
      
      editor.on('mrmonkey:changeSelection', function (event) {
  
        function getRandomChild(element) {
          var children = element.getChildren();
          if (children.count() == 0) {
            return element;
          } else {
            var child = children.getItem(Math.round(Math.random() * (children.count() - 1)));
            if (child.type == CKEDITOR.NODE_ELEMENT) {
              return getRandomChild(child); 
            } else {
              return child;    
            }
          }
        }
  
        var selectRanges = (editor.getMrMonkeySetting('selectRanges'));
        var selection = editor.getSelection();
        var range = new CKEDITOR.dom.range(editor.document);
        var selected = getRandomChild(editor.document.getBody());
        if (selected.type == CKEDITOR.NODE_TEXT) {
          var selectedContentLength = selected.getLength();
          var index = Math.round(Math.random() * (selectedContentLength - 1));
          range.setStart( selected, index );
          range.setEnd( selected, index);
        } else {
          range.selectNodeContents(selected);
        }
        
        selection.selectRanges([range]);
  
        // Schedule new selection change      
        scheduleSelectionChange(event.editor);
      });
      
      // Dialogs
      
      CKEDITOR.dialog.add( 'myMonkeySettingsDialog', this.path + 'dialogs/settings.js' );
  
      // Commands
      
      var toggleCommand = new CKEDITOR.command( editor, {
        exec: function( editor ) {
          this.toggleState();
          
          if (editor.isMrMonkeyRunning()) {
            if (editor.getMrMonkeySetting('pasteLoremIpsum')) {
              scheduleLoremIpsum(editor);
            }
          
            if (editor.getMrMonkeySetting('typeRandom')) {
              scheduleRandomTyping(editor);
            }
                
            if (editor.getMrMonkeySetting('selectionChange')) {
              scheduleSelectionChange(editor);
            }  
          }
        }
      });
      
      editor.addCommand( "toggleMrMonkey", toggleCommand);
      editor.addCommand( 'mrMonkeySettings', new CKEDITOR.dialogCommand( 'myMonkeySettingsDialog' ) );
  
      // Buttons
      
      editor.ui.addButton( 'ToggleMrMonkey', {
        label: 'Toggle Mr. Monkey',
        command: 'toggleMrMonkey',
        toolbar: 'others'
      });
  
      editor.ui.addButton( 'MrMonkeySettings', {
        label: 'Mr. Monkey Settings',
        command: 'mrMonkeySettings',
        toolbar: 'others'
      });
      
    }
  });

}).call(this);