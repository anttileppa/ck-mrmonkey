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