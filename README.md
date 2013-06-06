MrMonkey
===========

MrMonkey is a CKEditor plugin for simulating user actions such as moving cursor, typing and pasting. 

Plugin can be used for testing CKEditor plugins when developing them.

Installation
------------

###CKEditor Builder

Easiest way to install MrMonkey is to use the CKEditor builder and just simply add it to your editor.

###Manually

Another way is to download the zip package and unpack it into your CKEditor plugins -folder.

This does not yet enable the plugin so you need to add `extraPlugins:'mrmonkey'` into your CKEditor config.

e.g. into config.js:

    CKEDITOR.editorConfig = function( config ) {
      ...
      config.extraPlugins = 'mrmonkey';
    };

or in editor initialization:

    CKEDITOR.replace( 'editor', { 
      ...
      extraPlugins:'mrmonkey'
    }
    
Usage
-----

Using MrMonkey is easy. Just click the monkey head button on your toolbar and the monkey starts doing its thing.

MrMonkey's behaviour can be configured from the settings view. If your browser supports Web Storage (Internet Explorer 8+, Firefox, Opera, Chrome and Safari) your settings are saved into your browser and you don't need to change them everytime you start your editor.

You can also change the default settings by adding one or more of the following settings into your editor config (under mrmonkey setting):

* pasteLoremIpsumInterval
* typeRandomInterval
* selectionChangeInterval
* pasteLoremIpsum
* typeRandom
* selectionChange
* typeRandomMaxKeyStrokesAtOnce
* typeRandomKeyStrokeInterval
* pasteLoremIpsumBlockSize
* typeRandomKeys
* pasteLoremIpsumText

Example:

    CKEDITOR.replace( 'editor', { 
      ...
      mrmonkey: {
        pasteLoremIpsumInterval: 8000
      }
    }
 
 
